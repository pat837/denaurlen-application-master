import { useQuery } from 'react-query'
import valuationPostQueries from '.'

const useFetchHoldPosts = () =>
  useQuery('hold-post', valuationPostQueries.getPosts.valuation.hold, {
    select: res => res.data.posts
  })

export default useFetchHoldPosts
