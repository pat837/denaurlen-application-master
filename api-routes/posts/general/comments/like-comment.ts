import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import generalPostQueries, { IsLikedComment_ } from '..'
import { queryClient } from '../../../../config/query-client'
import getKeys from '../../../../config/storage-keys'
import { ErrorCallback_, SuccessCallback_ } from '../../../../types'

type UseLikeComment_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useLikeComment = ({ onError, onSuccess }: UseLikeComment_) =>
  useMutation(generalPostQueries.comments.like, {
    onMutate: (variables) => {
      const key = getKeys.post.general.comments.isLiked(variables.commentId)

      const previousData = queryClient.getQueryData<AxiosResponse<IsLikedComment_, any>>(key)

      if (previousData === undefined) return previousData

      queryClient.setQueryData(key, () => ({
        ...previousData,
        data: {
          ...previousData.data,
          isLiked: !previousData.data.isLiked,
          likesCount: previousData.data.likesCount + 1 * (previousData.data.isLiked ? -1 : 1)
        }
      }))

      return { previousData, key }
    },
    onSuccess: (data, variables, context) => {
      onSuccess()
    },
    onError: (
      error,
      variables,
      context:
        | {
            previousData: AxiosResponse<IsLikedComment_, any>
            key: string
          }
        | undefined
    ) => {
      onError()
      queryClient.setQueryData(context?.key || '', () => context?.previousData)
    }
  })

export default useLikeComment
