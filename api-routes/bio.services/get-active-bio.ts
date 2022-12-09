import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'

import storage from '../../config/storage'
import BioRoutes from './bio.routes'

import type { Bio_ } from '../../types/profile.type'

type Bio = Bio_ & { meaning: string }

const store = storage.local
const cacheAndStaleTime = 1000 * 60 * 30 // 👉 THIRTY MINUTES

export const activeBioKey = 'active-bio'

const useGetActiveBio = () => {
  const data: AxiosResponse<Bio, any> | null = store.get(activeBioKey)

  return useQuery(activeBioKey, ({ signal }) => BioRoutes.getActive(signal), {
    select: response => {
      store.add({ key: activeBioKey, value: response })

      return response.data
    },
    initialData: data || undefined,
    staleTime: cacheAndStaleTime,
    cacheTime: cacheAndStaleTime
  })
}

export default useGetActiveBio
