import { useInfiniteQuery } from 'react-query'
import { getNextPageParams } from '../../utils'
import queries from './profile.routes'

const useFetchUnselectedCategories = (size = 15) =>
  useInfiniteQuery(
    'unselect-categories',
    ({ pageParam = 1 }) => queries.unselectedCategories({ page: pageParam, size }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  )

export default useFetchUnselectedCategories
