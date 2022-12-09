import { useInfiniteQuery } from 'react-query'
import queries from '.'
import { getNextPageParams } from '../../../utils'

const followingOngoingPostKey = 'following-ongoing-post-key'

const useGetFollowingOngoingPost = (size = 10) =>
  useInfiniteQuery(
    followingOngoingPostKey,
    ({ pageParam = 1 }) => queries.getPosts.valuation.followingOngoing({ page: pageParam, size }),
    {
      select: response => {
        if (typeof response.pages?.[0].data.message === 'string')
          return {
            pageParams: [],
            pages: []
          }

        return {
          pageParams: [],
          pages: response.pages.map(page => ({
            posts: page.data.posts,
            views: page.data.views.map(view => view[0])
          }))
        }
      },
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  )

export default useGetFollowingOngoingPost
