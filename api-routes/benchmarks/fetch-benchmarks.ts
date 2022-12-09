import { useInfiniteQuery } from 'react-query'

import BenchmarksRoutes from './benchmarks.routes'

export const benchmarksKey = 'benchmarks'

const useFetchBenchmarks = (size = 20) =>
  useInfiniteQuery(
    benchmarksKey,
    ({ pageParam = 1, signal }) => BenchmarksRoutes.getPosts({ signal, size, page: pageParam || 1 }),
    {
      getNextPageParam: lastPage => {
        const currentPage = parseInt(`${lastPage.data.currentPage}`)

        return currentPage >= 50 ? undefined : currentPage + 1
      },
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => page.data.data)
      })
    }
  )

export default useFetchBenchmarks
