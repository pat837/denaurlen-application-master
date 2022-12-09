import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import storage from '../../config/storage'
import { categoriesListType } from '../../types'

import categoryRoutes from './category.routes'

const store = storage.local
const storageKey = 'AlZfvXR2JV'

export const ownedCategoriesKey = (username: string) => [storageKey, username]

const useGetOwnedCategories = (username: string, setStaleTime = false) => {
  const data: AxiosResponse<{ categories: categoriesListType }, any> | null = store.get(storageKey)
  const staleTime = setStaleTime ? 1000 * 60 * 30 : undefined // 👉 THIRTY MINUTES (or) undefined

  return useQuery(ownedCategoriesKey(username), ({ signal }) => categoryRoutes.getOwned({ username, signal }), {
    enabled: !!username,
    staleTime,
    cacheTime: staleTime,
    select: response => {
      if (setStaleTime) store.add({ key: storageKey, value: response })
      return response.data.categories
    },
    initialData: data || undefined
  })
}

export default useGetOwnedCategories
