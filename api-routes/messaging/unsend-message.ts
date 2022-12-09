import { AxiosResponse } from 'axios'
import { InfiniteData, useMutation } from 'react-query'

import chatRoutes from './messaging.routes'
import http from '../../config/http'
import { queryClient } from '../../config/query-client'
import { ErrorCallback_ } from '../../types'
import { FetchMessages_ } from '../../types/messaging.types'
import { chatQueryKey } from './fetch-chats'

type UnsendMessageParams_ = {
  messageId: string
}
type UseUnsendMessageParams_ = {
  chatId: string
  errorCallback: ErrorCallback_
}
type Data_ = InfiniteData<AxiosResponse<FetchMessages_, any>>

const unsendMessage = ({ messageId }: UnsendMessageParams_) => {
  return http.delete(chatRoutes.unsendMessage(messageId))
}

const useUnsendMessage = ({ chatId, errorCallback }: UseUnsendMessageParams_) =>
  useMutation(unsendMessage, {
    onMutate: variables => {
      const key = chatQueryKey(chatId)
      queryClient.cancelQueries(key)
      const data = queryClient.getQueryData<Data_>(key)

      if (data)
        queryClient.setQueryData<Data_>(key, {
          ...data,
          pages: data.pages.map(page => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.filter(message => message._id !== variables.messageId)
            }
          }))
        })
    },
    onError: (error, variables, context) => {
      errorCallback(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries(chatQueryKey(chatId))
    }
  })

export default useUnsendMessage
