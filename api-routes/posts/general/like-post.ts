import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import generalPostQueries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import { ErrorCallback_, genPostCountsResponseType, SuccessCallback_ } from '../../../types'
import { GetGeneralPostCounts_ } from '../../../types/general-post.types'

type UseLikePost_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

type Context_ =
  | {
      fallbackData: AxiosResponse<genPostCountsResponseType, any>
      key: string
    }
  | undefined

const useLikeGeneralPost = ({ onError, onSuccess }: UseLikePost_) => {
  return useMutation(generalPostQueries.like, {
    onMutate: (variables) => {
      const countsQueryKey = getKeys.post.general.getCounts(variables.postId)
      const fallbackData =
        queryClient.getQueryData<AxiosResponse<GetGeneralPostCounts_, any>>(countsQueryKey)

      if (fallbackData === undefined) return fallbackData

      queryClient.setQueryData(countsQueryKey, () => ({
        ...fallbackData,
        data: {
          ...fallbackData.data,
          isLiked: !fallbackData.data.isLiked,
          likesCount: fallbackData.data.likesCount + 1 * (fallbackData.data.isLiked ? -1 : 1)
        }
      }))

      return { fallbackData, key: countsQueryKey }
    },
    onSuccess: (data, variables, context: Context_) => {
      if (context?.key) queryClient.invalidateQueries(context.key)
      onSuccess()
    },
    onError: (error, variables, context: Context_) => {
      onError()
      queryClient.setQueryData(context?.key || '', () => context?.fallbackData)
    }
  })
}

export default useLikeGeneralPost
