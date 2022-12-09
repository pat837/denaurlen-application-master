import { useInfiniteQuery } from 'react-query'

import { queryClient } from '../../config/query-client'
import { getNextPageParams } from '../../utils'
import profileQueries from './profile.routes'

export const suggestionsKey = 'friend-suggestions'

const useFetchSuggestions = (size = 8) => ({
  ...useInfiniteQuery(
    suggestionsKey,
    ({ pageParam = 1 }) => profileQueries.suggestions({ page: pageParam, size }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  ),
  inValidate: () => queryClient.invalidateQueries(suggestionsKey)
})

export default useFetchSuggestions
