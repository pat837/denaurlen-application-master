import { useInfiniteQuery } from 'react-query'

import { getNextPageParams } from '../../utils'
import exploreRoutes from './explore.routes'

import type { GeneralPost_ } from '../../types/general-post.types'
import type { CategoryPostWithUploaderCategories_ } from '../../types/category-post.type'
import type { ValuationPost_ } from '../../types/valuation-post.type'

type Valuation_ = ValuationPost_ & { postType: 'VALUATION' }
type General_ = GeneralPost_ & { postType: 'GENERAL' }
type Category_ = CategoryPostWithUploaderCategories_ & { postType: 'TOP10' }

const TEN_MINUTES = 1000 * 60 * 10
const reserveSlots = [0, 1, 4, 7, 14, 17, 22, 23]

export const explorePagePostsKey = 'explore-post'

const useFetchExplorePagePosts = (size = 30) =>
  useInfiniteQuery(
    explorePagePostsKey,
    ({ pageParam = 1, signal }) => exploreRoutes.posts({ page: pageParam, size, signal }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => {
          let valuationPosts: Valuation_[] = []
          let categoryPosts: Category_[] = []
          let generalPosts: General_[] = []

          page.data.posts.forEach(post => {
            if (post.postType === 'TOP10') return categoryPosts.push(post)
            if (post.postType === 'VALUATION') return valuationPosts.push(post)
            generalPosts.push(post)
          })

          const posts = page.data.posts.map((_, index) => {
            if (reserveSlots.some(i => i === index)) {
              if (valuationPosts.length > 0) return valuationPosts.shift()
              if (categoryPosts.length > 0) return categoryPosts.shift()
              return generalPosts.shift()
            }
            if (generalPosts.length > 0) return generalPosts.shift()
            if (categoryPosts.length > 0) return categoryPosts.shift()
            if (valuationPosts.length > 0) return valuationPosts.shift()

            return _
          })

          return posts.map(post => {
            if (post === undefined) return

            if (post.postType === 'TOP10')
              return {
                ...post,
                uploader: {
                  _id: post.uploader._id,
                  profilePic: post.uploader.profilePic,
                  username: post.uploader.username
                },
                priority: post.uploader.categories.find(c => c.category === post.category._id)?.priority || 0
              }

            return post
          })
        })
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages),
      staleTime: TEN_MINUTES
    }
  )

export default useFetchExplorePagePosts
