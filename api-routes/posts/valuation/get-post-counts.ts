import { useQuery, UseQueryOptions } from 'react-query'
import valuationPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import storage from '../../../config/storage'

export type ValuationPostCounts_ = {
  interestsCount: number
  commentsCount: number
  isInterested: boolean
}

const useGetValuationPostCounts = ({ postId }: { postId: string }) => {
  const [key, store] = [getKeys.post.valuation.counts(postId), storage.session]

  let options: Omit<UseQueryOptions<any, any, ValuationPostCounts_, string>, 'queryKey' | 'queryFn'> = {
    select: (res) => {
      store.add({ key, value: res })
      return res.data
    },
    enabled: !!postId
  }

  const data = store.get(key)

  if (data) options = { ...options, initialData: data }

  return useQuery(key, () => valuationPostQueries.getCounts(postId), options)
}

export default useGetValuationPostCounts
