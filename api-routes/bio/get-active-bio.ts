import { useQuery } from 'react-query'

import storage from '../../config/storage'
import bioQueries from './bio.routes'

export const activeBioKey = 'active-bio'
const store = storage.local

const useGetActiveBio = () => {
  const data = store.get(activeBioKey)

  return useQuery(activeBioKey, () => bioQueries.currentBio(), {
    select: response => {
      store.add({ key: activeBioKey, value: response })

      return response.data
    },
    initialData: data || undefined
  })
}

export default useGetActiveBio
