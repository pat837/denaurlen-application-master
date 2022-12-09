import http from '../../config/http'

import type { categoriesListType } from '../../types'
import type { GetAllCategoriesResponse } from '../../types/category.types'

const url = {
  getAll: 'categories',
  owned: (username: string) => `/user/categories/${username}`
}

const getAllCategories = ({ signal }: { signal?: AbortSignal }) =>
  http.get<GetAllCategoriesResponse>(url.getAll, { signal })

const getOwnedCategories = ({ username, signal }: { username: string; signal?: AbortSignal }) => {
  return http.get<{ categories: categoriesListType }>(url.owned(username), { signal })
}

const categoryRoutes = {
  getAll: getAllCategories,
  getOwned: getOwnedCategories
}

export default categoryRoutes
