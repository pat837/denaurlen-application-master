import { useMediaQuery, useScrollTrigger } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import useGetPostsInHome from '../api-routes/home-services/fetch-posts'
import SuggestionCards from '../components/suggestion-cards'
import Button from '../components/ui/button'
import HomeScreenAppbar from '../components/ui/home-screen-appbar'
import LeaderboardSection from '../components/ui/leaderboard-section'
import PostCard from '../components/ui/post-card'
import StorySection from '../components/ui/story-section'
import useFetchNextPage from '../hooks/fetch-next-page.hook'
import useInViewport from '../hooks/in-viewport.hook'
import usePageTitle from '../hooks/page-title.hook'
import HomeLayout from '../layouts/home.layout'
import css from '../styles/pages/home.module.scss'

import type { storeType } from '../types'

type postType_ = 'VALUATION' | 'GENERAL' | 'TOP10'

const SIZE = 16 as const

const HomePage = () => {
  const isDesktop = useMediaQuery('(min-width: 1080px)')

  const [filterList, setFilterList] = useState<postType_[]>(['GENERAL', 'TOP10', 'VALUATION'])
  const [showRefresh, setShowRefresh] = useState(false)
  const refresh = useInViewport({})
  const trigger = useScrollTrigger({ target: undefined })
  const { autoHide } = useSelector((s: storeType) => s.navbar)

  useEffect(() => {
    if (refresh.isVisible) setShowRefresh(true)
  }, [refresh.isVisible])

  usePageTitle({ title: 'Home' })

  const setFilter = (type: postType_ | 'ALL') => {
    if (type === 'ALL') return setFilterList(['GENERAL', 'TOP10', 'VALUATION'] as postType_[])

    if (type === 'GENERAL') return setFilterList(['GENERAL'])

    if (type === 'TOP10') return setFilterList(['TOP10'])

    setFilterList(['VALUATION'])
  }

  const {
    data,
    inValidate: refreshQuery,
    isLoading,
    isLoadingError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useGetPostsInHome(SIZE)

  const refreshHandler = () => {
    if (showRefresh) {
      refreshQuery()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setShowRefresh(false)
    }
  }

  const nextPageTriggerRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  if (isLoading) return <>Loading...</>

  if (isLoadingError || !data?.pages.length) return <>Error while fetching</>

  return (
    <>
      <HomeScreenAppbar filter={setFilter} />
      <div className={`${css.refresh_btn} ${trigger && autoHide ? css.hide : showRefresh ? '' : css.hide}`}>
        <Button label="refresh" variant="blur" onClick={refreshHandler} />
      </div>
      <div className={css.wrapper}>
        <div className={css.story_wrapper}>
          <StorySection />
        </div>
        <div className={css.feed_container}>
          <div className={css.feed_wrapper}>
            {data.pages.map((page, index) => {
              const isLastPage = index + 1 === data.pages.length
              const refIndex = SIZE - 4

              return (
                <Fragment key={`page-${index}`}>
                  {page
                    .filter(post => filterList.some(type => type === post.postType))
                    .map((post, i) => (
                      <Fragment key={`${post._id}-${i}`}>
                        <span ref={isLastPage && refIndex === i ? nextPageTriggerRef : undefined} />
                        {filterList.some(postType => postType === post.postType) && (
                          <>
                            <PostCard key={`${i}-${post._id}`} {...post} />
                            <div className={css.gap} />
                          </>
                        )}
                      </Fragment>
                    ))}
                  {index === 0 && (
                    <>
                      <span ref={refresh.ref} />
                      <SuggestionCards />
                    </>
                  )}
                </Fragment>
              )
            })}
          </div>
        </div>
        <aside>{isDesktop && <LeaderboardSection />}</aside>
      </div>
    </>
  )
}

HomePage.Layout = HomeLayout

export default HomePage
