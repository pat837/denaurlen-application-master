import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'

import { queryClient } from '../../config/query-client'
import storage from '../../config/storage'
import profileRoutes from './profile.routes'

import type { Profile_ } from '../../types/profile.type'

const store = storage.local
export const profileKey = 'Z4S4fVf3NZ'
const getProfileKey = (username: string) => [profileKey, username]

const useGetProfile = (username: string, isOwnProfile: boolean) => {
  // getting initial data, key, and staleTime
  const data: AxiosResponse<Profile_, any> | null = isOwnProfile ? store.get(profileKey) : undefined
  const key = isOwnProfile ? profileKey : getProfileKey(username)
  const staleTime = isOwnProfile ? 1000 * 60 * 30 : undefined // 👉 THIRTY MINUTES (or) undefined

  return {
    ...useQuery(key, () => profileRoutes.profile.get(username), {
      select: response => {
        if (isOwnProfile) store.add({ key: profileKey, value: response })
        return response.data
      },
      enabled: !!username,
      initialData: data || undefined,
      staleTime,
      cacheTime: staleTime
    }),
    invalidateQuery: () => queryClient.invalidateQueries(key)
  }
}

export default useGetProfile
