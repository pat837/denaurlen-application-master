import { useInfiniteQuery } from 'react-query'

import { getNextPageParams } from '../../utils'
import exploreRoutes from './explore.routes'

export const explorePagePostsKey = 'explore-post-view'

const useFetchExplorePagePostsViews = (size = 30) =>
  useInfiniteQuery(
    explorePagePostsKey,
    ({ pageParam = 1, signal }) => exploreRoutes.posts({ page: pageParam, size, signal }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page =>
          page.data.posts.map(post => {
            if (post.postType === 'TOP10')
              return {
                ...post,
                uploader: {
                  _id: post.uploader._id,
                  profilePic: post.uploader.profilePic,
                  username: post.uploader.username
                },
                priority: post.uploader.categories.find(c => c.category === post.category._id)?.priority || 0
              }
            return post
          })
        )
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  )

export default useFetchExplorePagePostsViews
