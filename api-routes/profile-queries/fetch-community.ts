import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query'

import { queryClient } from '../../config/query-client'
import storage from '../../config/storage'
import { getNextPageParams } from '../../utils'
import profileQueries from './profile.routes'

type UseGetCommunityParams_ = {
  username: string
  size?: number
  storeData?: boolean
}

type User_ = {
  _id: string
  name: string
  username: string
  profilePic: string
  wallet: number
}

export const communityKey = (username: string) => `uw1puISaKf${username}`

const useGetCommunity = ({ username, size = 30, storeData = false }: UseGetCommunityParams_) => {
  const [key, store] = [communityKey(username), storage[storeData ? 'local' : 'session']]

  let options: Omit<UseInfiniteQueryOptions<any, any, User_[], string>, 'queryKey' | 'queryFn'> = {
    select: (res: any) => {
      store.add({ key, value: res })

      return {
        pageParams: res.pageParams,
        pages: res.pages.map((page: { data: { data: User_[] } }) => page.data.data)
      }
    },
    getNextPageParam: (lastPage: { data: { currentPage: number; pages: number } }) => {
      return getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  }

  const data = store.get(key)

  if (!!data) options = { ...options, initialData: data }

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => profileQueries.community({ username, size, page: pageParam || 1 }),
      options
    ),
    inValidate: () => {
      queryClient.invalidateQueries(key)
    }
  }
}

export default useGetCommunity
