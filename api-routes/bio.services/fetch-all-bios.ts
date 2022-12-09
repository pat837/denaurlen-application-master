import { useInfiniteQuery } from 'react-query'

import { queryClient } from '../../config/query-client'
import { getNextPageParams } from '../../utils'
import BioRoutes from './bio.routes'

type UseGetBiosParams_ = {
  size?: number
  search: string
}

export const allBiosKey = 'all-bios'

const useGetBios = ({ size = 30, search }: UseGetBiosParams_) => ({
  ...useInfiniteQuery(
    allBiosKey,
    ({ pageParam = 1, signal }) => BioRoutes.getAll({ page: pageParam, size, signal, search }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  ),
  inValidate: () => queryClient.invalidateQueries(allBiosKey)
})

export default useGetBios
