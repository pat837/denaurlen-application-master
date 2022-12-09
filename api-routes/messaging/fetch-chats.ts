import { useInfiniteQuery } from 'react-query'

import http from '../../config/http'
import { dateToFromNowDaily, getNextPageParams } from '../../utils'
import chatRoutes from './messaging.routes'

import type { FetchMessagesParams_, FetchMessages_ } from '../../types/messaging.types'
import { useContext } from 'react'
import { ProfileContext } from '../../contexts/profile.context'

export const chatQueryKey = (chatId: string) => `${chatId}62f9e842acdc`

const fetchConversations = ({ chatId, signal, ...params }: FetchMessagesParams_) => {
  return http.get<FetchMessages_>(chatRoutes.getMessages(chatId), { params })
}

const useFetchMessages = (chatId: string, watch = false, size = 20) => {
  const { profile } = useContext(ProfileContext)

  return useInfiniteQuery(
    chatQueryKey(chatId),
    ({ pageParam = 1, signal }) => fetchConversations({ chatId, page: pageParam, size, signal }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page =>
          page.data.data.map(message => ({
            ...message,
            date: dateToFromNowDaily(message.createdAt),
            isPost: !!message.postId,
            isSeen: (message?.readBy?.filter(id => id !== profile._id).length ?? 0) > 0
          }))
        )
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages),
      refetchInterval: watch ? 3 * 1000 : undefined
    }
  )
}

export default useFetchMessages
