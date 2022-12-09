import { useInfiniteQuery as useGet } from 'react-query'
import queries from '..'
import { queryClient } from '../../../../config/query-client'
import getKeys from '../../../../config/storage-keys'
import { getNextPageParams } from '../../../../utils'

type UseFetchGeneralPostCommentsParams_ = {
  postId: string
  size?: number
}

const useFetchGeneralPostComments = ({ postId, size = 20 }: UseFetchGeneralPostCommentsParams_) => {
  const key = getKeys.post.general.comments.get(postId)

  return {
    ...useGet(key, ({ pageParam = 1 }) => queries.comments.fetch({ postId, page: pageParam, size }), {
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages),
      select: response => ({
        ...response,
        pages: response.pages.map(page => page.data.comments)
      }),
      enabled: !!postId
    }),
    invalidateQuery: () => queryClient.invalidateQueries(key)
  }
}

export default useFetchGeneralPostComments
