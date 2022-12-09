import { useInfiniteQuery } from 'react-query'

import valuationPostQueries from '.'
import { queryClient } from '../../../config/query-client'
import { getNextPageParams } from '../../../utils'

type UseGetValuationPosts_ = {
  username: string
  size?: number
}

const useGetValuedPosts = ({ username, size = 30 }: UseGetValuationPosts_) => {
  const key = `v${username}-valued-posts`

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => valuationPostQueries.getPosts.valued.declared({ page: pageParam, size, username }),
      {
        getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages),
        select: res => ({
          pageParams: res.pageParams,
          pages: res.pages.map(page => page.data.posts)
        })
      }
    ),
    inValidate: () => {
      queryClient.invalidateQueries(key)
    }
  }
}

export default useGetValuedPosts
