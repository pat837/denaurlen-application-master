import { AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import followFollowingQueries from '.'
import storage from '../../../config/storage'
import { queryClient } from '../../../config/query-client'

export const useIsFollowing = (userId: string) => {
  const key = `IS_FOLLOWING_${userId}`

  let options: Omit<UseQueryOptions<any, any, boolean, string>, 'queryKey' | 'queryFn'> = {
    refetchInterval: 10 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    select: (res: AxiosResponse<any, any>): boolean => {
      storage.session.add({ key, value: res })
      return res.data.isFollowing
    },
    enabled: !!userId,
    staleTime: 2000
  }

  const data = storage.session.get(key)

  if (!!data)
    options = {
      ...options,
      initialData: data
    }

  return {
    ...useQuery(key, () => followFollowingQueries.isFollowing(userId), options),
    clearAndRefetchQuery: () => {
      queryClient.removeQueries(key)
      queryClient.resetQueries(key)
    }
  }
}

export default useIsFollowing
