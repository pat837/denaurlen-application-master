import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import categoryPostQueries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import { SuccessCallback_, ErrorCallback_ } from '../../../types'
import { FetchPostsByCategory_ } from '../../../types/category-post.type'

type UseAddCategoryPost_ = {
  callback: {
    success: SuccessCallback_
    error: ErrorCallback_
  }
  username: string
}

const useAddCategoryPost = ({ username, callback }: UseAddCategoryPost_) =>
  useMutation(categoryPostQueries.upload, {
    onSuccess: (data, variables, _context) => {
      queryClient.setQueryData(getKeys.post.counts(username), (oldQueryData: any) => {
        return !oldQueryData
          ? oldQueryData
          : {
              ...oldQueryData,
              data: {
                ...oldQueryData.data,
                categoryPosts: oldQueryData.data.categoryPosts + 1
              }
            }
      })

      const key = getKeys.post.category.byCategory({ username, categoryId: variables.categoryId })

      const queryData = queryClient.getQueryData<AxiosResponse<FetchPostsByCategory_, any>>(key)

      if (queryData)
        queryClient.setQueryData(key, {
          ...queryData.data[0],
          data: [{ ...data.data }, ...queryData.data].sort((a, b) => a.slot - b.slot)
        })

      callback.success()
    },
    onError: () => {
      callback.error()
    },
    onSettled: () => {
      queryClient.invalidateQueries(getKeys.post.general.get(username))
      queryClient.invalidateQueries(getKeys.post.counts(username))
    }
  })

export default useAddCategoryPost
