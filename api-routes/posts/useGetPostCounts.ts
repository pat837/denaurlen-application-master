import { AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'

import postServices from '.'
import storage from '../../config/storage'
import getKeys from '../../config/storage-keys'

type PostCounts_ = {
  generalPosts: number
  categoryPosts: number
  valuation: {
    collection: number
    onGoing: number
  }
}

const useGetPostCounts = (username: string, ownPostCounts = false) => {
  const [key, store] = [getKeys.post.counts(username), storage[ownPostCounts ? 'local' : 'session']]

  let options: Omit<UseQueryOptions<any, any, PostCounts_, string>, 'queryKey' | 'queryFn'> = {
    select: (res: AxiosResponse<any, any>) => {
      store.add({ key: key, value: res })
      return res.data
    },
    enabled: !!username,
    staleTime: 10 * 60 * 1000 // 👉 Ten Minutes
  }

  const storyViewData = storage.session.get(key)

  if (storyViewData) options = { ...options, initialData: storyViewData }

  return useQuery(key, () => postServices.postCounts(username), options)
}

export default useGetPostCounts
