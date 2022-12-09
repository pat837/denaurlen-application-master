import { useInfiniteQuery } from 'react-query'

import { queryClient } from '../../config/query-client'
import { getNextPageParams } from '../../utils'
import bioQueries from './bio.routes'

type UseGetOwnedBiosParams_ = {
  size?: number
  search: string
}

export const ownedBiosKey = 'owned-bios'

const useGetOwnedBios = ({ size = 30, search }: UseGetOwnedBiosParams_) => ({
  ...useInfiniteQuery(
    ownedBiosKey,
    ({ pageParam = 1, signal }) => bioQueries.getOwned({ page: pageParam, size, search, signal }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  ),
  inValidate: () => {
    queryClient.invalidateQueries(ownedBiosKey)
  }
})

export default useGetOwnedBios
