import { useQuery } from 'react-query'
import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'

const useIsStoryViewed = (storyId: string) => ({
  ...useQuery(getKeys.story.isViewed(storyId), () => queries.isViewed({ storyId }), {
    select: (res) => res.data,
    enabled: !!storyId
  }),
  invalidateQuery: () => queryClient.invalidateQueries(getKeys.story.isViewed(storyId))
})

const useIsStoriesViewed = (storyIdList: string[], username: string) => ({
  ...useQuery(getKeys.story.isViewedAll(username), () => queries.isStoriesViewed(storyIdList), {
    select: (responses) => responses.map((res) => res.data.isViewed),
    enabled: storyIdList.length > 0
  }),
  invalidateQuery: () => queryClient.invalidateQueries(getKeys.story.isViewedAll(username))
})

export { useIsStoryViewed }

export default useIsStoriesViewed
