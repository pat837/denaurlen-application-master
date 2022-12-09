import { AxiosError, AxiosResponse } from 'axios'
import { InfiniteData, useMutation } from 'react-query'

import http from '../../config/http'
import { queryClient } from '../../config/query-client'
import { chatQueryKey } from './fetch-chats'
import chatRoutes from './messaging.routes'

import type { FetchMessages_, SendMessageParams_ } from '../../types/messaging.types'

type Data_ = InfiniteData<AxiosResponse<FetchMessages_, any>>
type UseSendMessageParams_ = {
  profileId: string
}

const sendMessage = ({ chatId, ...params }: SendMessageParams_) => http.post(chatRoutes.sendMessage(chatId), params)

const useSendMessage = ({ profileId }: UseSendMessageParams_) => {
  return useMutation(sendMessage, {
    onMutate: variables => {
      const key = chatQueryKey(variables.chatId)

      queryClient.cancelQueries(key)
      const data = queryClient.getQueryData<Data_>(key)

      if (data)
        queryClient.setQueryData<Data_>(key, {
          ...data,
          pages: data.pages.map((page, pageNo) => ({
            ...page,
            data: {
              ...page.data,
              data:
                pageNo === 0
                  ? [
                      {
                        _id: `${Date.now()}`,
                        createdAt: new Date(),
                        message: variables.message,
                        sender: profileId,
                        readBy: []
                      },
                      ...page.data.data
                    ]
                  : page.data.data
            }
          }))
        })
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries(chatQueryKey(variables.chatId))
    }
  })
}

export default useSendMessage
