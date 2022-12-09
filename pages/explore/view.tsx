import { useMediaQuery } from '@mui/material'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'

import useFetchExplorePagePostsViews from '../../api-routes/explore/fetch-posts-view'
import BenchmarksSection from '../../components/ui/benchmarks-section'
import PostCard from '../../components/ui/post-card'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/explore/explore.module.scss'

import type { storeType } from '../../types'
const ExplorePostViewPage = () => {
  const [{ post }, isDesktop] = [
    useSelector((s: storeType) => s.explore),
    useMediaQuery('(min-width: 1280px)')
  ]

  usePageTitle({ title: 'Explore' })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchExplorePagePostsViews()

  const nextPageTriggerRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  return (
    <div className={css.view_page_wrapper}>
      <div className={css.view_page}>
        <PostCard {...post} />
        <div className={css.gap} />
        {data?.pages.map((page, pageNo) => {
          const isLastPage = data.pages.length === pageNo + 1

          return page.map((post, index) => (
            <Fragment key={post?._id}>
              <span id={post?._id} />
              <div
                className={css.gap}
                ref={isLastPage && 24 === index ? nextPageTriggerRef : undefined}
              />
              <PostCard key={post._id} {...post} />
              <div className={css.gap} />
            </Fragment>
          ))
        })}
      </div>
      {isDesktop && (
        <aside>
          <BenchmarksSection />
        </aside>
      )}
    </div>
  )
}

ExplorePostViewPage.Layout = HomeLayout

export default ExplorePostViewPage
