import { useInfiniteQuery } from 'react-query'

import { getNextPageParams } from '../../utils'
import routes from './privacy.routes'

export const muteUsersKey = 'muted-users'

const useGetMutedUsers = (size = 20) =>
  useInfiniteQuery(muteUsersKey, ({ pageParam = 1 }) => routes.getMutedUsers({ page: pageParam, size }), {
    select: response => ({
      pageParams: response.pageParams,
      pages: response.pages.map(page =>
        page.data.data.map(item => ({
          user: item.mutedId,
          createdAt: item.createdAt
        }))
      )
    }),
    getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
  })

export default useGetMutedUsers
