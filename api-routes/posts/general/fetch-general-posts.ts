import { useInfiniteQuery } from 'react-query'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'
import generalPostQueries from './index'
import { getNextPageParams } from '../../../utils'

type UseGetGeneralPostsParams_ = {
  username: string
  size?: number
}

const useGetGeneralPosts = ({ username, size = 30 }: UseGetGeneralPostsParams_) => {
  const key = getKeys.post.general.get(username)

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => generalPostQueries.getPosts({ page: pageParam, size, username }),
      {
        enabled: !!username,
        getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.page),
        select: response => ({
          pageParams: response.pageParams,
          pages: response.pages.map(page => page.data.posts)
        })
      }
    ),
    inValidate: () => {
      queryClient.invalidateQueries(key)
    }
  }
}

export default useGetGeneralPosts
