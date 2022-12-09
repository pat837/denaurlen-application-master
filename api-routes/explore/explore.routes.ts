import http from '../../config/http'

import type { PaginationParams_, PaginationResponse_ } from '../../types'
import type { GeneralPost_ } from '../../types/general-post.types'
import type { CategoryPostWithUploaderCategories_ } from '../../types/category-post.type'
import type { ValuationPost_ } from '../../types/valuation-post.type'

type Posts_ = (
  | (ValuationPost_ & { postType: 'VALUATION' })
  | (GeneralPost_ & { postType: 'GENERAL' })
  | (CategoryPostWithUploaderCategories_ & { postType: 'TOP10' })
)[]

export type FetchExplorePagePosts_ = PaginationResponse_ & { posts: Posts_ }

const urls = { posts: '/user/explore' }

const fetchExplorePagePosts = ({ signal, ...params }: PaginationParams_ & { signal?: AbortSignal }) =>
  http.get<FetchExplorePagePosts_>(urls.posts, { params, signal })

const exploreRoutes = { posts: fetchExplorePagePosts }

export default exploreRoutes
