import { useInfiniteQuery } from 'react-query'
import categoryPostQueries from '.'
import getKeys from '../../../config/storage-keys'

type UseFetchCategoryPostInterests_ = {
  postId: string
  size?: number
}

const useFetchCategoryPostInterests = ({ postId, size = 20 }: UseFetchCategoryPostInterests_) =>
  useInfiniteQuery(
    getKeys.post.category.interests(postId),
    ({ pageParam = 1 }) => categoryPostQueries.viewInteresting({ postId, page: pageParam, size }),
    {
      select: (response) => ({
        ...response,
        pages: response.pages.map((page) => page.data.data)
      }),
      enabled: !!postId,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 2
    }
  )

export default useFetchCategoryPostInterests
