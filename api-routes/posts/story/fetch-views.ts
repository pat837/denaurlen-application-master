import { useInfiniteQuery, useQuery } from 'react-query'
import storyQueries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import { getNextPageParams } from '../../../utils'

type UseFetchStoryViews_ = {
  storyId: string
  size?: number
}

const useFetchGeneralStoryViews = ({ storyId, size = 20 }: UseFetchStoryViews_) => {
  const key = getKeys.story.general.getViews(storyId)

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => storyQueries.general.getViews({ storyId, size, page: pageParam }),
      {
        enabled: !!storyId,
        select: response => ({
          pageParams: response.pageParams,
          pages: response.pages.map(page => page.data.data)
        }),
        getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
      }
    ),
    inValidate: () => {
      queryClient.invalidateQueries(key)
    }
  }
}

export { useFetchGeneralStoryViews }
