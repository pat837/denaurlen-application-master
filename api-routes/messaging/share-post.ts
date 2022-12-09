import { useMutation } from 'react-query'

import http from '../../config/http'
import useToastMessage from '../../hooks/toast-message.hook'
import chatRoutes from './messaging.routes'

type SharePostParams =
  | {
      to_user: string
      isForwarded: boolean
      postId: string
    }
  | { message: string; to_user: string; isForwarded: boolean }

type SharePostToManyProps =
  | {
      usersIdList: string[]
      isForwarded: boolean
      postId: string
    }
  | { message: string; usersIdList: string[]; isForwarded: boolean }

const sharePost = (params: SharePostParams) => http.post(chatRoutes.sharePost, params)

const useSharePost = () => {
  const showToast = useToastMessage()

  return useMutation(sharePost, {
    onSuccess: (data, variables, context) => {
      showToast(data?.data?.message ?? 'Post shared')
    },
    onError(error: any, variables, context) {
      showToast(error?.response?.data?.message || 'Unable to send the post')
    }
  })
}

const sharePostToMany = ({ usersIdList, ...params }: SharePostToManyProps) =>
  Promise.all(usersIdList.map(to_user => sharePost({ ...params, to_user })))

export const useSharePostToMany = () => {
  const showToast = useToastMessage()

  return useMutation(sharePostToMany, {
    onSuccess: (data, variables, context) => {
      showToast(data?.[0].data?.message ?? 'Post shared')
    },
    onError(error: any, variables, context) {
      showToast('Unable to share the post')
    }
  })
}

export default useSharePost
