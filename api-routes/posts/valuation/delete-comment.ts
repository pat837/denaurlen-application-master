import { useMutation } from 'react-query'
import valuationPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'
import { ErrorCallback_, SuccessCallback_ } from '../../../types'

type UseDeleteValuationPostComment_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useDeleteValuationPostComment = ({ onError, onSuccess }: UseDeleteValuationPostComment_) =>
  useMutation(valuationPostQueries.comment.delete, {
    onMutate: (variables) => {
      let fallBackData
      queryClient.setQueryData(
        getKeys.post.valuation.getComments(variables.postId),
        (previousData: any) => {
          fallBackData = previousData
          return {
            ...previousData,
            pages: previousData?.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                comments: page.data.comments.filter(
                  (comment: { commentId: string }) => comment.commentId !== variables.commentId
                )
              }
            }))
          }
        }
      )

      return { fallBackData }
    },
    onSuccess: (_data, _variables, _context) => {
      onSuccess()
    },
    onError: ( _error, variables, context: { fallBackData: any } | undefined ) => {
      queryClient.setQueryData(
        getKeys.post.valuation.getComments(variables.postId),
        () => context?.fallBackData
      )
      onError()
    }
  })

export default useDeleteValuationPostComment
