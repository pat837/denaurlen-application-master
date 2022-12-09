import { useMediaQuery } from '@mui/material'

import { postType_ } from '../api-routes/posts/post-like/post-like.routes'
import usePopup from './popup.hook'

type UseOpenPostLikesParams_ = {
  type: postType_
  postId: string
}

const useOpenPostLikes = (params: UseOpenPostLikesParams_) => {
  const { openPopup } = usePopup()
  const isDesktop = useMediaQuery('(min-width: 720px)')

  return () => openPopup('post-likes', { params, shallow: isDesktop })
}

export default useOpenPostLikes
