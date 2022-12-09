import { useQuery } from 'react-query'
import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'

const useFetchViewCounts = (postId: string) => ({
  ...useQuery(getKeys.post.valuation.getViewCounts(postId), () => queries.getViewCounts(postId), {
    select: (response) => response.data
  }),
  invalidateQuery: () => queryClient.invalidateQueries(getKeys.post.valuation.getViewCounts(postId))
})

export default useFetchViewCounts
