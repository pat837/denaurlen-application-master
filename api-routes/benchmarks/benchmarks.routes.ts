import { AxiosResponse } from 'axios'
import http from '../../config/http'
import { PaginationParams_, PostUploader_ } from '../../types'
import { ValuationPostStatus_ } from '../../types/valuation-post.type'

type BenchmarksResponse_ = {
  pages: number
  currentPage: number
  data: {
    _id: string
    uploader: PostUploader_
    src: string[]
    caption: string
    place: string
    ratio: string
    postKeeper: PostUploader_
    highestValuer: PostUploader_
    baseValue: number
    netWorth: number
    grossWorth: number
    status: ValuationPostStatus_
    createdAt: Date
  }[]
}

type GetPosts = (
  params: PaginationParams_ & { signal?: AbortSignal }
) => Promise<AxiosResponse<BenchmarksResponse_, any>>

/**
 * Benchmarks Routers
 * * getPosts: Returns promise of axios response containing benchmarks posts
 */
abstract class BenchmarksRoutes {
  private static readonly getURL = 'user/benchmarks'

  /**
   * Returns promise of axios response containing benchmarks posts
   * @method
   * @param params.signal  AbortSignal for fetch request.
   * @param params.page  current page number  for pagination.
   * @param params.size  Size docs or records per page for pagination.
   */
  static getPosts: GetPosts = ({ signal, ...params }) => http.get(this.getURL, { params, signal })
}

export default BenchmarksRoutes
