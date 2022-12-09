import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import queries from '..'
import { queryClient } from '../../../../config/query-client'
import getKeys from '../../../../config/storage-keys'
import { ErrorCallback_, SuccessCallback_ } from '../../../../types'
import { FetchIsCategoryPostCommentInterested_ } from '../../../../types/category-post.type'

type QueryData_ = AxiosResponse<FetchIsCategoryPostCommentInterested_, any>

type InterestCategoryPostComment_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}
type Context_ =
  | {
      key: string
      fallbackData?: QueryData_
    }
  | undefined

const useInterestCategoryPostComment = ({ onError, onSuccess }: InterestCategoryPostComment_) =>
  useMutation(queries.comments.interest, {
    onMutate: (variables): Context_ => {
      const key = getKeys.post.category.isCommentInterested(variables.commentId)

      const queryData = queryClient.getQueryData<QueryData_>(key)

      queryClient.setQueryData(
        key,
        !queryData
          ? queryData
          : {
              ...queryData,
              data: {
                ...queryData.data,
                isInterested: !queryData.data.isInterested,
                interestsCount:
                  queryData.data.interestsCount + 1 * (queryData.data.isInterested ? -1 : 1)
              }
            }
      )

      return { key, fallbackData: queryData }
    },
    onSuccess: () => {
      onSuccess()
    },
    onError(error, variables, context: Context_) {
      queryClient.setQueryData(context?.key || '', context?.fallbackData)
      onError()
    },
    onSettled(data, error, variables, context: Context_) {
      queryClient.invalidateQueries(context?.key || '')
    }
  })

export default useInterestCategoryPostComment
