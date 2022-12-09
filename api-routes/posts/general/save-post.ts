import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import { ErrorCallback_, genPostCountsResponseType, SuccessCallback_ } from '../../../types'

type UseLikePost_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useSaveGeneralPost = ({ onSuccess, onError }: UseLikePost_) => {
  return useMutation(queries.save, {
    onMutate(variables) {
      const countsQueryKey = getKeys.post.general.getCounts(variables)
      const fallbackData =
        queryClient.getQueryData<AxiosResponse<genPostCountsResponseType, any>>(countsQueryKey)

      if (fallbackData === undefined) return fallbackData

      queryClient.setQueryData(countsQueryKey, () => ({
        ...fallbackData,
        data: {
          ...fallbackData.data,
          isSaved: !fallbackData.data.isSaved
        }
      }))

      return { fallbackData, key: countsQueryKey }
    },
    onSuccess: (data, variables, context) => {
      onSuccess()
    },
    onError: (
      error,
      variables,
      context?: {
        fallbackData: AxiosResponse<genPostCountsResponseType, any>
        key: string
      }
    ) => {
      onError()
      queryClient.setQueryData(context?.key || '', () => context?.fallbackData)
    }
  })
}

export default useSaveGeneralPost
