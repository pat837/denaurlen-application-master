import { useInfiniteQuery } from 'react-query'

import { queryClient } from '../../config/query-client'
import { getNextPageParams } from '../../utils'
import HomePageRoutes from './home.routes'

export const homePagePostsKey = 'p65BCvRM9S'

const useGetPostsInHome = (size = 10) => ({
  ...useInfiniteQuery(
    homePagePostsKey,
    ({ pageParam = 1, signal }) => HomePageRoutes.getPosts({ page: pageParam, size, signal }),
    {
      select: response => ({
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
        ),
        pageParams: response.pageParams
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  ),
  inValidate: () => queryClient.invalidateQueries(homePagePostsKey)
})

export default useGetPostsInHome
