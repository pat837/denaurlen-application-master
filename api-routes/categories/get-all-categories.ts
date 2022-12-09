import { useQuery } from 'react-query'
import routes from './category.routes'

export const allCategoriesKey = 'all-categories'

const useGetAllCategories = () => useQuery(allCategoriesKey, routes.getAll, { select: res => res.data.categories })

export default useGetAllCategories
