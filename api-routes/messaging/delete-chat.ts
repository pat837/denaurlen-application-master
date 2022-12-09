import { AxiosResponse } from 'axios'
import { InfiniteData, useMutation } from 'react-query'

import chatRoutes from './messaging.routes'
import http from '../../config/http'
import { queryClient } from '../../config/query-client'
import { ErrorCallback_ } from '../../types'
import { FetchMessages_ } from '../../types/messaging.types'
import { chatQueryKey } from './fetch-chats'

type ClearChatParams_ = {
  chatId: string
}
type UseClearChatParams_ = {
  errorCallback: ErrorCallback_
}
type Data_ = InfiniteData<AxiosResponse<FetchMessages_, any>>

const clearChat = ({ chatId }: ClearChatParams_) => {
  return http.delete(chatRoutes.clearChat(chatId))
}

const useClearChat = ({ errorCallback }: UseClearChatParams_) =>
  useMutation(clearChat, {
    onMutate: variables => {
      const key = chatQueryKey(variables.chatId)
      queryClient.cancelQueries(key)
      const data = queryClient.getQueryData<Data_>(key)

      if (data)
        queryClient.setQueryData<Data_>(key, {
          ...data,
          pages: data.pages.map(page => ({
            ...page,
            data: {
              ...page.data,
              data: []
            }
          }))
        })
    },
    onError: (error, _variables, _context) => {
      errorCallback(error)
    },
    onSettled(_data, _error, variables, _context) {
      queryClient.invalidateQueries(chatQueryKey(variables.chatId))
    }
  })

export default useClearChat
