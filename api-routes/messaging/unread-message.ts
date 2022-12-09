import { useQuery } from 'react-query'

import chatRoutes from './messaging.routes'
import http from '../../config/http'

const unreadMessageKey = `NiIsInR5cCI6IkpX`

const useNewMessageCount = ({ watch = false }) =>
  useQuery(
    unreadMessageKey,
    ({ signal }) =>
      http.get<{
        messageCount: number
      }>(chatRoutes.getNewMessage, { signal }),
    {
      select: response => response.data.messageCount,
      refetchInterval: watch ? 4 * 1000 : undefined // 👉 FOUR SECONDS (or) undefined
    }
  )

export default useNewMessageCount
