import { useQuery } from 'react-query'
import profileQueries from './profile.routes'

const communityCountsKey = (username: string) => `J1AG${username}`

const useFetchCommunityCounts = (username: string) =>
  useQuery(communityCountsKey(username), () => profileQueries.communityCounts(username), {
    select: response => response.data
  })

export default useFetchCommunityCounts
