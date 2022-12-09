import { useQuery } from 'react-query'
import valuationPostQueries from '.'
import getKeys from '../../../config/storage-keys'

const useGetValuationPostById = (postId: string) =>
  useQuery(getKeys.post.valuation.getById(postId), () => valuationPostQueries.getById(postId), {
    select: res => res.data.data,
    enabled: !!postId
  })

export default useGetValuationPostById
