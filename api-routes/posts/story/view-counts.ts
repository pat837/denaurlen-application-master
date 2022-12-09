import { useQuery } from 'react-query'
import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'

const useStoryViewCounts = (storyId: string) => ({
  ...useQuery(getKeys.story.getCounts(storyId), () => queries.general.getCounts({ storyId }), {
    select: (res) => res.data.count,
    enabled: !!storyId,
    staleTime: 1000 * 60 * 30
  }),
  invalidateQuery: () => queryClient.invalidateQueries(getKeys.story.getCounts(storyId))
})

export default useStoryViewCounts
