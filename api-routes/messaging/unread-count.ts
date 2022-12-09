import { useQuery } from 'react-query'

import chatRoutes from './messaging.routes'
import http from '../../config/http'

const unreadCountKey = (chatId: string) => `${chatId}-78tr_lr`

const getUnreadCount = ({ chatId }: { chatId: string }) => {
  return http.get<{
    data: number
  }>(chatRoutes.getUnreadCount(chatId))
}

const useGetUnreadCount = (chatId: string) => {
  return useQuery(unreadCountKey(chatId), () => getUnreadCount({ chatId }), {
    refetchInterval: 3 * 1000,
    select: response => response.data.data
  })
}

export default useGetUnreadCount
