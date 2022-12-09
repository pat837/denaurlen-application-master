import { useQuery } from 'react-query'
import categoryService from '.'
import keys from '../../../config/storage-keys'

const useGetCategoryPostCounts = (postId: string) =>
  useQuery(keys.post.category.counts(postId), () => categoryService.getCounts({ postId }), {
    select: (response) => response.data,
    enabled: !!postId,
    staleTime: 1000 * 60 * 2
  })

export default useGetCategoryPostCounts
