import { useQuery } from 'react-query'
import categoryPostQueries from '..'
import getKeys from '../../../../config/storage-keys'
import { FetchIsCategoryPostCommentInterestedParams_ as FetchParams_ } from '../../../../types/category-post.type'

const useFetchIsInterestedCategoryPostComment = ({ commentId }: FetchParams_) => {
  const key = getKeys.post.category.isCommentInterested(commentId)

  return useQuery(key, () => categoryPostQueries.comments.isInterested({ commentId }), {
    select: (response) => response.data,
    staleTime: 1000 * 60 * 2
  })
}

export default useFetchIsInterestedCategoryPostComment
