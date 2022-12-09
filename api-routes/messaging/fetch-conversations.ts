import { useInfiniteQuery } from 'react-query'

import chatRoutes from './messaging.routes'
import http from '../../config/http'
import { getNextPageParams } from '../../utils'

import type { FetchConversationParams_, FetchConversation_ } from '../../types/messaging.types'

export const conversationQueryKey = '62f9e842a1000cdc'

const fetchConversations = (params: FetchConversationParams_) => {
  return http.get<FetchConversation_>(chatRoutes.conversations, { params })
}

const useFetchConversations = (watch = false, size = 20) => {
  return useInfiniteQuery(
    conversationQueryKey,
    ({ pageParam = 1, signal }) => fetchConversations({ page: pageParam, size, signal }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages),
      refetchInterval: watch ? 3 * 1000 : undefined
    }
  )
}

export default useFetchConversations
