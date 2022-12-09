import { useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { POSTS_PER_PAGE } from '.'
import useFetchBenchmarks from '../../api-routes/benchmarks/fetch-benchmarks'
import LeaderboardSection from '../../components/ui/leaderboard-section'
import ValuationPostCard from '../../components/ui/valuation-post/valuation-post-card'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/benchmarks/benchmarks-post-page.module.scss'
import { ifElse } from '../../utils'

const BenchmarksPostViewPage = () => {
  const [router, isDesktop] = [useRouter(), useMediaQuery('(min-width: 1280px)')]

  usePageTitle({ title: 'Benchmarks' })

  useEffect(() => {
    const postId = router.query?.postId

    if (!!postId) {
      const post = document.getElementById(postId.toString())
      if (!!post) {
        const headerOffset = 80
        const postPosition = post.getBoundingClientRect().top
        const offsetPosition = postPosition + window.pageYOffset - headerOffset
        window.scrollTo({ top: offsetPosition, behavior: 'auto' })
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }, [router.query?.postId])

  const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } =
    useFetchBenchmarks(POSTS_PER_PAGE)

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false
  })

  return (
    <div className={css.page_wrapper}>
      <div className={css.page}>
        <div className={css.main}>
          {data?.pages.map((page, pageNo) => {
            const isLastPage = data.pages.length === pageNo + 1

            return page.map((post, index) => (
              <div key={post._id} ref={ifElse(isLastPage && index === 15, nextPageTrigger, undefined)}>
                <ValuationPostCard
                  _id={post._id}
                  uploader={post.uploader}
                  src={post.src}
                  caption={post.caption}
                  place={post.place}
                  ratio={post.ratio}
                  postKeeper={post.postKeeper}
                  baseValue={post.baseValue}
                  status={post.status}
                  createdAt={post.createdAt}
                  highestValuer={post.highestValuer._id}
                  netWorth={0}
                  rank={POSTS_PER_PAGE * pageNo + index + 1}
                />
              </div>
            ))
          })}
          <div />
        </div>
      </div>
      {isDesktop && (
        <aside>
          <LeaderboardSection />
        </aside>
      )}
    </div>
  )
}

BenchmarksPostViewPage.Layout = HomeLayout

export default BenchmarksPostViewPage
