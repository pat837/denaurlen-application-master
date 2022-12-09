import { InfiniteData, useMutation } from 'react-query'
import generalPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'
import { ErrorCallback_, SuccessCallback_ } from '../../../types'
import { AxiosResponse } from 'axios'
import {
  FetchGeneralPosts_,
  FetchSavedPosts_,
  FetchTaggedPosts_
} from '../../../types/general-post.types'

type UseDeleteGeneralPost_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
  username: string
}

type GeneralPostsData_ = InfiniteData<AxiosResponse<FetchGeneralPosts_, any>>
type SavedPostsData_ = InfiniteData<AxiosResponse<FetchSavedPosts_, any>>
type TaggedPostsData_ = InfiniteData<AxiosResponse<FetchTaggedPosts_, any>>

type Context_ =
  | {
      key: {
        getGeneralPostKey: string
        getSavedPostKey: string
        getTaggedPostKey: string
      }
      data: {
        generalPostsData: GeneralPostsData_ | undefined
        savedPostData: SavedPostsData_ | undefined
        taggedPostData: TaggedPostsData_ | undefined
      }
    }
  | undefined

const useDeleteGeneralPost = ({ onSuccess, onError, username }: UseDeleteGeneralPost_) =>
  useMutation(generalPostQueries.delete, {
    onMutate(variables) {
      const [getGeneralPostKey, getSavedPostKey, getTaggedPostKey] = [
        getKeys.post.general.get(username),
        getKeys.post.general.getSaved(),
        getKeys.post.general.getTagged()
      ]

      const [generalPostsData, savedPostData, taggedPostData] = [
        queryClient.getQueryData<GeneralPostsData_>(getGeneralPostKey),
        queryClient.getQueryData<SavedPostsData_>(getSavedPostKey),
        queryClient.getQueryData<TaggedPostsData_>(getTaggedPostKey)
      ]

      if (generalPostsData)
        queryClient.setQueryData(getGeneralPostKey, () => ({
          ...generalPostsData,
          pages: generalPostsData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.filter((post) => post._id !== variables.postId)
            }
          }))
        }))

      if (savedPostData)
        queryClient.setQueryData(getSavedPostKey, () => ({
          ...savedPostData,
          pages: savedPostData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.filter((post) => post._id !== variables.postId)
            }
          }))
        }))

      if (taggedPostData)
        queryClient.setQueryData(getTaggedPostKey, () => ({
          ...taggedPostData,
          pages: taggedPostData.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.filter((post) => post._id !== variables.postId)
            }
          }))
        }))

      return {
        key: { getGeneralPostKey, getSavedPostKey, getTaggedPostKey },
        data: {
          generalPostsData,
          savedPostData,
          taggedPostData
        }
      }
    },
    onSuccess: (data, variables, context) => {
      onSuccess()
    },
    onError: (error, variables, context: Context_) => {
      queryClient.setQueryData(
        context?.key.getGeneralPostKey || '',
        () => context?.data.generalPostsData
      )
      queryClient.setQueryData(
        context?.key.getSavedPostKey || '',
        () => context?.data.savedPostData
      )
      queryClient.setQueryData(
        context?.key.getTaggedPostKey || '',
        () => context?.data.taggedPostData
      )
      onError()
    }
  })

export default useDeleteGeneralPost
