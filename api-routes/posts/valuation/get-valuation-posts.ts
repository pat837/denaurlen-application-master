import { useInfiniteQuery } from 'react-query'
import valuationPostQueries from '.'
import { queryClient } from '../../../config/query-client'
import { getNextPageParams } from '../../../utils'

type UseGetValuationPosts_ = {
  username: string
  size?: number
}

const useGetValuationPosts = ({ username, size = 20 }: UseGetValuationPosts_) => {
  const key = `valuation-post-${username}`

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => valuationPostQueries.getPosts.valuation.declared({ page: pageParam, size, username }),
      {
        getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages),
        select: response => ({
          pageParams: response.pageParams,
          pages: response.pages.map(page => page.data.posts)
        })
      }
    ),
    inValidate: () => queryClient.invalidateQueries(key)
  }
}

export default useGetValuationPosts
