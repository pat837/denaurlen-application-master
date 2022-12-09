import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import categoryPostQueries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import { ErrorCallback_, SuccessCallback_ } from '../../../types'
import { FetchCategoryPostCounts_ } from '../../../types/category-post.type'

type FallbackData_ = AxiosResponse<FetchCategoryPostCounts_, any>
type Context_ =
  | {
      fallbackData: FallbackData_ | undefined
      key: string
    }
  | undefined

type UseInterestCategoryPost_ = {
  successCallback: SuccessCallback_
  errorCallback: ErrorCallback_
}

const useInterestCategoryPost = ({ successCallback, errorCallback }: UseInterestCategoryPost_) => {
  return useMutation(categoryPostQueries.interestPost, {
    onMutate: (variables): Context_ => {
      const key = getKeys.post.category.counts(variables)

      const data = queryClient.getQueryData<FallbackData_>(key)

      if (data)
        queryClient.setQueryData(key, () => ({
          ...data,
          data: {
            ...data.data,
            isInterested: !data.data.isInterested,
            interestsCount: data.data.interestsCount + 1 * (data.data.isInterested ? -1 : 1)
          }
        }))

      return { fallbackData: data, key }
    },
    onSuccess: () => {
      successCallback()
    },
    onError(_error, _variables, context: Context_) {
      queryClient.setQueryData(context?.key || '', context?.fallbackData)
      errorCallback()
    },
    onSettled(_data, _error, variables, context: Context_) {
      queryClient.invalidateQueries(context?.key || '')
      queryClient.invalidateQueries(getKeys.post.category.interests(variables))
    }
  })
}

export default useInterestCategoryPost
