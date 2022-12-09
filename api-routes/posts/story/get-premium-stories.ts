import { AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import storyQueries from '.'
import getKeys from '../../../config/storage-keys'
import storage from '../../../config/storage'

type PremiumStory_ = {
  _id: string
  uploader: string
  src: string
  stats: {
    views?: number
    isViewed: boolean
    isSpend?: boolean
    isAgreed?: boolean,
    agreedCount?: number
  }
  createdAt: Date,
  worth: number
}


const useGetPremiumStories = (username: string, saveData = false) => {
  const [key, store] = [
    getKeys.story.premium.get(username),
    storage[saveData ? 'local' : 'session']
  ]

  let options: Omit<UseQueryOptions<any, any, PremiumStory_[], string>, 'queryKey' | 'queryFn'> = {
    select: (res: AxiosResponse<any, any>) => {
      store.add({ key: key, value: res })
      return res.data.data
    },
    enabled: !!username,
    retry: true
  }

  const storyViewData = storage.session.get(key)

  if (storyViewData) options = { ...options, initialData: storyViewData }

  return useQuery(key, () => storyQueries.premium.get(username), options)
}

export default useGetPremiumStories
