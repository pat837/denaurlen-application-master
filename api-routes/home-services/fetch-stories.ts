import { useInfiniteQuery } from 'react-query'

import { queryClient } from '../../config/query-client'
import storage from '../../config/storage'
import { getNextPageParams } from '../../utils'
import HomePageRoutes from './home.routes'

export const homePageStoriesKey = 'k3Pv0PD46C'

const useGetStories = (size = 20) => {
  const store = storage.session

  const data = store.get(homePageStoriesKey)

  return {
    ...useInfiniteQuery(
      homePageStoriesKey,
      ({ pageParam = 1, signal }) => HomePageRoutes.getStories({ page: pageParam, size, signal }),
      {
        select: response => ({
          pageParams: response.pageParams,
          pages: response.pages.map(page => page.data.data)
        }),
        getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages),
        initialData: data || undefined
      }
    ),
    inValidate: () => queryClient.invalidateQueries(homePageStoriesKey)
  }
}

export default useGetStories
