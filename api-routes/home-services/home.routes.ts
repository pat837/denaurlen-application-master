import { AxiosResponse } from 'axios'

import http from '../../config/http'

import type { GeneralPost_ } from '../../types/general-post.types'
import type { CategoryPostWithUploaderCategories_ } from '../../types/category-post.type'
import type { ValuationPost_ } from '../../types/valuation-post.type'
import type { PaginationParams_, PaginationResponse_, PostUploader_ } from '../../types'

export type FetchHomePageStories = {
  pages: number
  currentPage: number
  data: PostUploader_[]
}

type Posts_ = (
  | (ValuationPost_ & { postType: 'VALUATION' })
  | (GeneralPost_ & { postType: 'GENERAL' })
  | (CategoryPostWithUploaderCategories_ & { postType: 'TOP10' })
)[]

type FetchHomePagePosts_ = PaginationResponse_ & { posts: Posts_ }

type Params_ = PaginationParams_ & { signal?: AbortSignal }

type GetPosts = ({ signal, ...params }: Params_) => Promise<AxiosResponse<FetchHomePagePosts_, any>>

type GetStories = ({ signal, ...params }: Params_) => Promise<AxiosResponse<FetchHomePageStories, any>>

/**
 * Home page API routes
 * * getPosts: Returns promise of axios response containing home page posts
 * * getStories: Returns promise of axios response containing list of users who uploaded story(s)
 */
abstract class HomePageRoutes {
  private static readonly postURL = 'user/home'
  private static readonly storiesURL = 'user/home-stories'

  /**
   * Returns promise of axios response containing home page posts
   * @method
   * @param params.signal  AbortSignal for fetch request.
   * @param params.page  current page number  for pagination.
   * @param params.size  Size docs or records per page for pagination.
   */
  static getPosts: GetPosts = ({ signal, ...params }) => http.get(this.postURL, { params, signal })

  /**
   * Returns promise of axios response containing list of users who uploaded story(s)
   * @method
   * @param params.signal  AbortSignal for fetch request.
   * @param params.page  current page number  for pagination.
   * @param params.size  Size docs or records per page for pagination.
   */
  static getStories: GetStories = ({ signal, ...params }) => http.get(this.storiesURL, { params, signal })
}

export default HomePageRoutes
