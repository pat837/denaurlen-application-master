import { useInfiniteQuery } from 'react-query'

import { getNextPageParams } from '../../utils'
import routes from './privacy.routes'

export const blockedUsersKey = 'blocked-users'

const useGetBlockedUsers = (size = 20) =>
  useInfiniteQuery(
    blockedUsersKey,
    ({ pageParam = 1 }) => routes.getBlockedUsers({ page: pageParam, size }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page =>
          page.data.data.map(item => ({
            user: item.blockedId,
            createdAt: item.createdAt
          }))
        )
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  )

export default useGetBlockedUsers
