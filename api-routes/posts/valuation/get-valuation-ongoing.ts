import { useInfiniteQuery } from 'react-query'

import valuationPostQueries from '.'

type UseGetValuationPosts_ = {
  username: string
  isOthers?: boolean
}

const ongoingValuationPostKey = (username: string) => `valuation-ongoing-${username}`

const useGetOngoingValuationPosts = ({ username, isOthers = false }: UseGetValuationPosts_) => ({
  ...useInfiniteQuery(
    ongoingValuationPostKey(username),
    () => valuationPostQueries.getPosts.valuation.ongoing({ username, isOthers }),
    {
      select: res => ({
        pageParams: res.pageParams,
        pages: res.pages.map(page => ({
          posts: page.data.posts,
          views: page.data.views.map(view => view[0])
        }))
      }),
      enabled: !!username
    }
  )
})

export default useGetOngoingValuationPosts
