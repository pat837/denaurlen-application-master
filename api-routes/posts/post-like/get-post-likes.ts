import { useInfiniteQuery } from 'react-query'

import { getNextPageParams } from '../../../utils'
import routes, { postType_ } from './post-like.routes'

type UseFetchPostLikesParams_ = {
  type: postType_
  postId: string
  size?: number
}

const postLikesKey = (postId: string) => `post-likes-${postId}`

const useFetchPostLikes = ({ size = 30, ...rest }: UseFetchPostLikesParams_) => {
  const key = postLikesKey(rest.postId)

  return useInfiniteQuery(
    key,
    ({ pageParam = 1 }) => routes.getLikes({ size, page: pageParam, ...rest }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(
          page => (page.data?.likedBy === undefined && page.data.data) || page.data.likedBy
        )
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.page)
    }
  )
}

export default useFetchPostLikes
