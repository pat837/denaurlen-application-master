import { UseInfiniteQueryOptions, useInfiniteQuery } from 'react-query'
import storyQueries from '.'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'
import storage from '../../../config/storage'
import { getNextPageParams } from '../../../utils'

type View_ = {
  userId: {
    _id: string
    name: string
    username: string
    profilePic: string
  }
  isSpend: boolean
  isAgreed: boolean
  _id: string
  createdAt: string
}

const useGetPremiumStoryViews = ({ storyId, isEnabled }: { storyId: string; isEnabled: boolean }) => {
  const [key, store] = [getKeys.story.premium.getViews(storyId), storage.session]

  let options: Omit<UseInfiniteQueryOptions<any, any, View_[], string>, 'queryKey' | 'queryFn'> = {
    select: (res: any) => {
      store.add({ key, value: res })

      return {
        pageParams: res.pageParams,
        pages: res.pages.map((page: { data: { data: any } }) => page.data.data)
      }
    },
    getNextPageParam: (lastPage: { data: { currentPage: number; pages: number } }) => {
      return getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    },
    enabled: isEnabled && !!storyId
  }

  const data = store.get(key)

  if (!!data) options = { ...options, initialData: data }

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => storyQueries.premium.getViews({ storyId, page: pageParam || 1, size: 30 }),
      options
    ),
    inValidate: () => {
      queryClient.invalidateQueries(key)
    }
  }
}

export default useGetPremiumStoryViews
