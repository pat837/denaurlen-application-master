import { useQuery } from 'react-query'
import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'

const useFetchStoriesByUsername = (username: string) => ({
  ...useQuery(getKeys.story.getByUsername(username), () => queries.getByUsername({ username }), {
    select: res => res.data,
    enabled: !!username,
    staleTime: 1000 * 60 * 30
  }),
  invalidateQuery: () => queryClient.invalidateQueries(getKeys.story.getByUsername(username))
})

export default useFetchStoriesByUsername
