import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import categoryService from '.'
import storage from '../../../config/storage'
import getKeys from '../../../config/storage-keys'
import { FetchSlotOnePostParams_, FetchSlotOnePost_ } from '../../../types/category-post.type'

const useFetchSlotOnePost = (params: FetchSlotOnePostParams_, storeData = false) => {
  const [queryKey, store] = [
    getKeys.post.category.slotOnePost(params),
    storage[storeData ? 'local' : 'session']
  ]

  const storedData: AxiosResponse<FetchSlotOnePost_, any> = store.get(queryKey)

  return useQuery(queryKey, () => categoryService.get.slotOnePost(params), {
    select: (response) => {
      store.add({ key: queryKey, value: response })
      return response.data
    },
    enabled: !!params.username && !!params.categoryId,
    initialData: storedData || undefined
  })
}

export default useFetchSlotOnePost
