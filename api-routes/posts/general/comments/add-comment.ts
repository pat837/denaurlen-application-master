import { AxiosResponse } from 'axios'
import { InfiniteData, useMutation } from 'react-query'
import queries from '..'
import { queryClient } from '../../../../config/query-client'
import getKeys from '../../../../config/storage-keys'
import { ErrorCallback_, PostUploader_, SuccessCallback_ } from '../../../../types'
import {
  FetchGeneralPostComments_,
  GetGeneralPostCounts_
} from '../../../../types/general-post.types'

type UseCommentGeneralPost_ = {
  user: PostUploader_ & { name: string }
  callback: {
    success: SuccessCallback_
    error: ErrorCallback_
  }
}
type QueryData_ = InfiniteData<AxiosResponse<FetchGeneralPostComments_, any>>
type CountsData_ = AxiosResponse<GetGeneralPostCounts_, any>

const useCommentGeneralPost = ({ user, callback }: UseCommentGeneralPost_) => {
  return useMutation(queries.comments.add, {
    onSuccess({ data }, variables, _context) {
      const [commentsKey, countsKey] = [
        getKeys.post.general.comments.get(variables.postId),
        getKeys.post.general.getCounts(variables.postId)
      ]

      const queryData = queryClient.getQueryData<QueryData_>(commentsKey)
      const countsData = queryClient.getQueryData<CountsData_>(countsKey)

      const newData = !queryData
        ? queryData
        : {
            ...queryData,
            pages: queryData.pages.map((page) => ({
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
      queryClient.invalidateQueries(getKeys.post.general.comments.get(variables.postId))
      queryClient.invalidateQueries(getKeys.post.general.getCounts(variables.postId))
    }
  })
}

export default useCommentGeneralPost
