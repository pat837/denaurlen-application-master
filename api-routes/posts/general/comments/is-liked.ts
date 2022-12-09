import { useQuery } from 'react-query'
import generalPostQueries from '..'
import { queryClient } from '../../../../config/query-client'
import getKeys from '../../../../config/storage-keys'

const useIsLikedComment = (commentId: string) => {
  const key = getKeys.post.general.comments.isLiked(commentId)

  return {
    ...useQuery(key, () => generalPostQueries.comments.isLiked(commentId), {
      select: (res) => res.data,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
      enabled: !!commentId
    }),
    invalidateQuery: () => queryClient.invalidateQueries(key)
  }
}

export default useIsLikedComment
