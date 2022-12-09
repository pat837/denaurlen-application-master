import valuationPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import { useQuery } from 'react-query'

const useIsValuationCommentInterested = (commentId: string) => {
  const key = getKeys.post.category.isCommentInterested(commentId)

  return useQuery(key, () => valuationPostQueries.comment.isCommentInterested({ commentId }), {
    select: (response: { data: any }) => response.data,
    staleTime: 1000 * 60 * 2
  })
}

export default useIsValuationCommentInterested