import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query'

import valuationPostQueries from '.'
import { queryClient } from '../../../config/query-client'
import storage from '../../../config/storage'
import { ValuationPostWithHighestValuer_ } from '../../../types/valuation-post.type'
import { getNextPageParams } from '../../../utils'

type UseGetValuationPosts_ = {
  username: string
  size?: number
  storeData?: boolean
}

const useGetOngoingValuedPosts = ({ username, size = 30, storeData = false }: UseGetValuationPosts_) => {
  const [key, store] = [`${username}-valued-ongoing`, storage[storeData ? 'local' : 'session']]

  let options: Omit<
    UseInfiniteQueryOptions<any, any, ValuationPostWithHighestValuer_[], string>,
    'queryKey' | 'queryFn'
  > = {
    select: (res: any) => {
      store.add({ key, value: res })
      return {
        pageParams: res.pageParams,
        pages: res.pages.map((page: { data: { posts: ValuationPostWithHighestValuer_[] } }) => page.data.posts)
      }
    },
    getNextPageParam: (lastPage: { data: { currentPage: number; pages: number } }) => {
      return getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    },
    enabled: !!username
  }

  const data = store.get(key)

  if (!!data) options = { ...options, initialData: data }

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => valuationPostQueries.getPosts.valued.ongoing({ page: pageParam, size, username }),
      options
    ),
    inValidate: () => {
      queryClient.invalidateQueries(key)
    }
  }
}

export default useGetOngoingValuedPosts
