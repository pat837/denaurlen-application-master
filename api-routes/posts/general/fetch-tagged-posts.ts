import { useInfiniteQuery } from 'react-query'
import generalPostService from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import { getNextPageParams } from '../../../utils'

const useFetchTaggedPost = (size = 20) => {
  const key = getKeys.post.general.getTagged()

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => generalPostService.getTaggedPost({ page: pageParam, size }),
      {
        select: (response) => ({
          pageParams: response.pageParams,
          pages: response.pages.map((page) => page.data.data)
        }),
        getNextPageParam: (lastPage) => getNextPageParams(lastPage.data.currentPage, lastPage.data.page)
      }
    ),
    inValidate: () => queryClient.invalidateQueries(key)
  }
}

export default useFetchTaggedPost
