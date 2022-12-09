import { AxiosResponse } from 'axios'
import { InfiniteData, useMutation } from 'react-query'
import categoryPostQueries from '..'
import { queryClient } from '../../../../config/query-client'
import getKeys from '../../../../config/storage-keys'
import { ErrorCallback_, PostUploader_, SuccessCallback_ } from '../../../../types'
import { FetchCategoryPostComments_, FetchCategoryPostCounts_ } from '../../../../types/category-post.type'

type UseCommentCategoryPost_ = {
  user: PostUploader_ & { name: string }
  callback: {
    success: SuccessCallback_
    error: ErrorCallback_
  }
}
type QueryData_ = InfiniteData<AxiosResponse<FetchCategoryPostComments_, any>>
type CountsData_ = AxiosResponse<FetchCategoryPostCounts_, any>

const useCommentCategoryPost = ({ user, callback }: UseCommentCategoryPost_) => {
  return useMutation(categoryPostQueries.comments.post, {
    onSuccess({ data }, variables, _context) {
      const [commentsKey, countsKey] = [
        getKeys.post.category.comments(variables.postId),
        getKeys.post.category.counts(variables.postId)
      ]

      const queryData = queryClient.getQueryData<QueryData_>(commentsKey)
      const countsData = queryClient.getQueryData<CountsData_>(countsKey)

      const newData = !queryData
        ? queryData
        : {
            ...queryData,
            pages: queryData.pages.map(page => ({
              ...page,
              data: {
                ...page.data,
                comments: [
                  {
                    commentId: data._id,
                    comment: data.comment,
                    commenter: user,
                    postedAt: data.createdAt
                  },
                  ...page.data.comments
                ]
              }
            }))
          }

      queryClient.setQueryData(commentsKey, newData)
      queryClient.setQueryData(
        countsKey,
        !countsData
          ? countsData
          : {
              ...countsData,
              data: { ...countsData.data, commentsCount: countsData.data.commentsCount + 1 }
            }
      )
      callback.success()
    },
    onError: () => {
      callback.error()
    },
    onSettled: (_data, _error, variables, _context) => {
      queryClient.invalidateQueries(getKeys.post.category.comments(variables.postId))
      queryClient.invalidateQueries(getKeys.post.category.counts(variables.postId))
    }
  })
}

export default useCommentCategoryPost
