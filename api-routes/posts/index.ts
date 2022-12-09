import { AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'

import http from '../../config/http'

import type {
  generalPostsByUsernameResponseType as gpByUserType,
  viewCommentResponseType,
  viewLikesResponseType
} from '../../types'
import type { GeneralPost_ } from '../../types/general-post.types'

type addGeneralPostParams = {
  image: Blob
  caption?: string
  place?: string
  tags?: number
  ratio: number
}

type postCategoryPostParams = {
  image: Blob
  title?: string
  url?: string
  caption?: string
  slot: number
  ratio: string
  categoryId: string
}

type addStoryParams = {
  image: Blob
  caption?: string
}

let postServices = {
  addGeneralPost: (post: addGeneralPostParams) => {
    const formData = new FormData()

    const image = new File([post.image], 'image.png', {
      type: post.image.type
    })

    formData.append('general', image)
    formData.append('place', post?.place || '')
    formData.append('caption', post?.caption || '')
    formData.append('tags', JSON.stringify(post.tags || []))
    formData.append('ratio', post.ratio.toString())

    return http.post('/user/general-post/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  addCategoryPost: (post: postCategoryPostParams) => {
    const formData = new FormData()

    const image = new File([post.image], 'image.png', {
      type: post.image.type
    })

    formData.append('category_slot', image)
    formData.append('url', post?.url || '')
    formData.append('caption', post?.caption || '')
    formData.append('title', post.title || '')
    formData.append('category', post.categoryId)
    formData.append('slot', post.slot.toString())
    formData.append('ratio', post.ratio)

    return http.post('/user/category-post/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  addStory: (post: addStoryParams) => {
    const formData = new FormData()

    const image = new File([post.image], 'image.png', {
      type: post.image.type
    })

    formData.append('story', image)
    formData.append('caption', post.caption || '')

    return http.post('/user/general-story', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getGeneralPosts: ({ page, size }: { page?: number; size?: number }) =>
    http.get(`/user/general-post/?page=${page}&size=${size}`),
  getGeneralPost: (id: string) => http.get(`/user/general-post/post/${id}`),
  likePost: (id: string) => http.post(`/user/general-post/like/${id}`),
  commentPost: (postId: string, comment: string) => http.post(`/user/general-post/comment/${postId}`, { comment }),
  getGeneralPostCounts: (id: string) => http.get(`/user/general-post/counts/${id}`),
  savePost: (id: string) => http.post(`/user/general-post/save/post/${id}`),
  viewLikes: ({ postId, page, size }: { postId: string; page?: number; size?: number }) =>
    http.get(`/user/general-post/likes/view/${postId}?page=${page}&size=${size}`),
  viewComments: ({ postId, page, size }: { postId: string; page?: number; size?: number }) =>
    http.get(`/user/general-post/comments/view/${postId}?page=${page}&size=${size}`),
  deleteGeneralPost: (postId: string) => http.delete(`/user/general-post/${postId}`),
  getGeneralPostsByUsername: ({ username, page, size }: { username: string; page: number; size: number }) =>
    http.get(`/user/general-post/${username}?page=${page}&size=${size}`),
  likeComment: (postId: string, commentId: string) =>
    http.post(`/user/general-post/comment/like/${postId}/${commentId}`),

  deleteCategoryPost: (postId: string) => http.delete(`/user/category-post/${postId}`),
  postCounts: (username: string) => http.get(`/user/posts-count/${username}`)
}

export const useGetGeneralPostById = (id: string) => {
  const options: Omit<
    UseQueryOptions<any, any, GeneralPost_, ('GET_GENERAL_POST' | string)[]>,
    'queryKey' | 'queryFn'
  > = {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    select: (res: AxiosResponse<any, any>) => res.data
  }

  return useQuery(['GET_GENERAL_POST', id], () => postServices.getGeneralPost(id), options)
}

export const useViewLikes = (postId: string, page = 1, size = 20) => {
  const opt: Omit<UseQueryOptions<any, any, viewLikesResponseType, (string | number)[]>, 'queryKey' | 'queryFn'> = {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30 * 1000,
    select: (res: AxiosResponse<any, any>) => res.data,
    keepPreviousData: true
  }
  return useQuery(
    ['VIEW_POST_LIKES', page, postId, size],
    () => postServices.viewLikes({ postId, page, size }),
    opt
  )
}

export const useViewComments = (postId: string, page = 1, size = 20) => {
  const opt: Omit<
    UseQueryOptions<any, any, viewCommentResponseType, (string | number)[]>,
    'queryKey' | 'queryFn'
  > = {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    select: (res: AxiosResponse<any, any>) => {
      return res.data
    },
    keepPreviousData: true
  }
  return useQuery(
    ['VIEW_COMMENTS', page, postId, size],
    () =>
      postServices.viewComments({
        postId,
        page,
        size
      }),
    opt
  )
}

postServices = { ...postServices }

export default postServices
