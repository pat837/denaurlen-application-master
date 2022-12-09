import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query'
import valuationPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'
import storage from '../../../config/storage'
import { getNextPageParams } from '../../../utils'

type UserList_ = {
  _id: string
  name: string
  username: string
  profilePic: string
}

const useGetInterestingForValuationPost = ({ postId, size = 30 }: { postId: string; size?: number }) => {
  const [key, store] = [getKeys.post.valuation.getInterests(postId), storage.session]

  let options: Omit<UseInfiniteQueryOptions<any, any, UserList_[], string>, 'queryKey' | 'queryFn'> = {
    select: (res: any) => {
      store.add({ key, value: res })
      return {
        pageParams: res.pageParams,
        pages: res.pages.map((page: { data: { data: UserList_[] } }) => page.data.data)
      }
    },
    getNextPageParam: (lastPage: { data: { currentPage: number; pages: number } }) => {
      return getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    },
    enabled: !!postId
  }

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => valuationPostQueries.getInterests({ postId, page: pageParam, size }),
      options
    ),
    inValidate: () => {
      queryClient.invalidateQueries(key)
    }
  }
}

export default useGetInterestingForValuationPost
