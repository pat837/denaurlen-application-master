import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import categoryPostQueries from '.'
import storage from '../../../config/storage'
import getKeys from '../../../config/storage-keys'
import { FetchPostsByCategoryParams_, FetchPostsByCategory_ } from '../../../types/category-post.type'

type UseFetchPostByCategory_ = FetchPostsByCategoryParams_ & { storeData?: boolean }

const useFetchPostByCategory = ({ storeData = false, ...params }: UseFetchPostByCategory_) => {
  const [key, store] = [
    getKeys.post.category.byCategory(params),
    storage[storeData ? 'local' : 'session']
  ]

  const storedData: AxiosResponse<FetchPostsByCategory_, any> | null = store.get(key)

  return useQuery(key, () => categoryPostQueries.get.byCategory(params), {
    select: (response) => {
      store.add({ key, value: response })
      return response.data.sort((a, b) => a.slot - b.slot)
    },
    enabled: !!params.categoryId && !!params.username,
    initialData: storedData || undefined
  })
}

export default useFetchPostByCategory
