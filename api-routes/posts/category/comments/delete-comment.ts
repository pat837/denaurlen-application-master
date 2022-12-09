import { AxiosResponse } from 'axios'
import { InfiniteData, useMutation } from 'react-query'
import categoryPostQueries from '..'
import { queryClient } from '../../../../config/query-client'
import getKeys from '../../../../config/storage-keys'
import { ErrorCallback_, SuccessCallback_ } from '../../../../types'
import { FetchCategoryPostComments_, FetchCategoryPostCounts_ } from '../../../../types/category-post.type'

type DeleteCategoryPostComment_ = {
  postId: string
  callback: {
    success: SuccessCallback_
    error: ErrorCallback_
  }
}
type QueryData_ = InfiniteData<AxiosResponse<FetchCategoryPostComments_, any>>
type CountsData_ = AxiosResponse<FetchCategoryPostCounts_, any>
type Context_ =
  | {
      queryData?: QueryData_
      countsData?: CountsData_
    }
  | undefined

const useDeleteCategoryPostComment = ({ postId, callback }: DeleteCategoryPostComment_) => {
  const [key, countsKey] = [
    getKeys.post.category.comments(postId),
    getKeys.post.category.counts(postId)
  ]

  return useMutation(categoryPostQueries.comments.delete, {
    onMutate: (variables): Context_ => {
      const queryData = queryClient.getQueryData<QueryData_>(key)
      const countsData = queryClient.getQueryData<CountsData_>(countsKey)

      if (queryData === undefined) return undefined

      queryClient.setQueryData(key, {
        ...queryData,
        pages: queryData.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            comments: page.data.comments.filter(
              (comment) => comment.commentId !== variables.commentId
            )
          }
        }))
      })

      queryClient.setQueryData(
        countsKey,
        !countsData
          ? countsData
          : {
              ...countsData,
              data: { ...countsData.data, commentsCount: countsData.data.commentsCount - 1 }
            }
      )

      return { queryData, countsData }
    },
    onSuccess: () => {
      callback.success()
    },
    onError: (_error, _variables, context: Context_) => {
      queryClient.setQueryData(key, context?.queryData)
      queryClient.setQueryData(countsKey, context?.countsData)
      callback.error()
    },
    onSettled: () => {
      queryClient.invalidateQueries(key)
      queryClient.invalidateQueries(countsKey)
    }
  })
}

export default useDeleteCategoryPostComment
