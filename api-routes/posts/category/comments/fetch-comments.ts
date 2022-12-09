import { useInfiniteQuery } from 'react-query'
import categoryPostQueries from '..'
import { getNextPageParams } from '../../../../utils'
import getKeys from '../../../../config/storage-keys'

type UseFetchCategoryPostComments_ = {
  postId: string
  size?: number
}

const useFetchCategoryPostComments = ({ postId, size = 20 }: UseFetchCategoryPostComments_) => {
  return useInfiniteQuery(
    getKeys.post.category.comments(postId),
    ({ pageParam = 1 }) => categoryPostQueries.comments.get({ postId, page: pageParam, size }),
    {
      select: response => ({
        ...response,
        pages: response.pages.map(page => page.data.comments)
      }),
      enabled: !!postId,
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  )
}

export default useFetchCategoryPostComments
