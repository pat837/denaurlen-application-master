import { useQuery } from 'react-query'
import categoryService from '.'

const useGetCategoryPostById = (postId: string) =>
  useQuery(`beY8e9uy${postId}`, () => categoryService.get.byId(postId), {
    select: response => response.data.data
  })

export default useGetCategoryPostById
