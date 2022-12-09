import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import { homePagePostsKey } from '../../home-services/fetch-posts'

import type { ErrorCallback_, SuccessCallback_ } from '../../../types'
import type { FetchPostsByCategory_ } from '../../../types/category-post.type'

type EditCategoryPost_ = {
  categoryId: string
  username: string
  successCallback: SuccessCallback_
  errorCallback: ErrorCallback_
}
type Context_ =
  | {
      home: {
        fallbackData: unknown
        key: string
      }
      category: {
        fallbackData: AxiosResponse<FetchPostsByCategory_, any> | undefined
        key: string
      }
    }
  | undefined

const useEditCategoryPost = (params: EditCategoryPost_) => {
  const { categoryId, username, successCallback, errorCallback } = params

  const [categoryKey, homeKey] = [getKeys.post.category.byCategory({ categoryId, username }), homePagePostsKey]

  return useMutation(queries.editPost, {
    onMutate: (variables): Context_ => {
      const [categoryPostsData, homeQueryData] = [
        queryClient.getQueryData<AxiosResponse<FetchPostsByCategory_, any>>(categoryKey),
        queryClient.getQueryData(homeKey)
      ]

      if (categoryPostsData)
        queryClient.setQueryData(categoryKey, () => ({
          ...categoryPostsData,
          data: categoryPostsData.data.map(post => ({
            ...post,
            caption: post._id === variables.postId ? variables.caption : post.caption,
            title: post._id === variables.postId ? variables.title : post.title,
            url: post._id === variables.postId ? variables.url : post.url
          }))
        }))

      return {
        home: { fallbackData: homeQueryData, key: homeKey },
        category: { fallbackData: categoryPostsData, key: categoryKey }
      }
    },
    onSuccess: () => {
      successCallback()
    },
    onError: (error, variables, context: Context_) => {
      queryClient.setQueryData(context?.category.key || '', context?.category.fallbackData)
      queryClient.setQueryData(context?.home.key || '', context?.home.fallbackData)
      errorCallback()
    },
    onSettled: (data, error, variables, context: Context_) => {
      queryClient.invalidateQueries(context?.category.key)
      queryClient.invalidateQueries(context?.home.key)
    }
  })
}

export default useEditCategoryPost
