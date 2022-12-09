import { ButtonBase, Skeleton, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import PullToRefresh from 'react-simple-pull-to-refresh'

import useFetchExplorePagePosts from '../../api-routes/explore/fetch-posts'
import CoinsIcon2 from '../../components/icons/coins2.icon'
import MultiPostIcon from '../../components/icons/multi-post.icon'
import TopTenPostIcon from '../../components/icons/top10-post.icon'
import VideoFilledIcon from '../../components/icons/video-filled.icon'
import ExploreSearchScreen from '../../components/screens/explore.search/explore-search.screen'
import ConditionalRender from '../../components/ui/conditional-render'
import HideOnScroll from '../../components/ui/hide-on-scroll'
import Picture from '../../components/ui/picture'
import { explorePageActions } from '../../data/actions'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import usePageTitle from '../../hooks/page-title.hook'
import usePopup from '../../hooks/popup.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/explore/explore.module.scss'
import { numberFormat } from '../../utils'

import type { GeneralPost_ } from '../../types/general-post.types'
import type { CategoryPost_ } from '../../types/category-post.type'
import type { ValuationPost_ } from '../../types/valuation-post.type'

const ExplorePage = () => {
  const [dispatch, router] = [useDispatch(), useRouter()]

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useFetchExplorePagePosts()
  const { openPopup } = usePopup()
  const isDesktop = useMediaQuery('(min-width: 1080px)')

  usePageTitle({ title: 'Explore' })

  const onClick =
    (
      post:
        | (ValuationPost_ & { postType: 'VALUATION' })
        | (GeneralPost_ & { postType: 'GENERAL' })
        | (CategoryPost_ & { postType: 'TOP10'; priority: number })
        | undefined
    ) =>
    () => {
      if (typeof post === 'undefined') return null

      dispatch(explorePageActions.setInitialPost(post))
      router.push('/explore/view')
    }
  const searchHandler = () => openPopup('explore-search')

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  return (
    <div className={css.page}>
      {isDesktop || (
        <HideOnScroll>
          <div className={css.search_wrapper}>
            <div className={css.fix} />
            <div className={css.search_}>
              <ButtonBase onClick={searchHandler} className={css.btn}>
                Search...
              </ButtonBase>
            </div>
          </div>
        </HideOnScroll>
      )}
      <PullToRefresh onRefresh={() => refetch()} refreshingContent={<p>refreshing...</p>}>
        <ConditionalRender condition={isLoading}>
          <div className={css.posts_section}>
            <section>
              {Array.from(Array(12).keys()).map(i => (
                <Skeleton key={i} variant="rectangular" width="100%" height="100%" animation="wave" />
              ))}
            </section>
          </div>
          <div className={css.posts_section}>
            {data?.pages.map((page, pageNo) => {
              const isLastPage = data.pages.length === pageNo + 1

              return (
                <section key={pageNo}>
                  {page.map((post, index) => (
                    <ButtonBase
                      key={post?._id}
                      aria-label={`explore-post-${index}`}
                      onClick={onClick(post)}
                      ref={(isLastPage && index === 18 && nextPageTrigger) || undefined}
                    >
                      {
                        <Picture
                          src={post?.postType === 'GENERAL' && post.isVideo ? post.thumbnail : post?.src[0] || ''}
                          alt={`explore-post-${index}`}
                          width={'100%'}
                          height={'100%'}
                          objectFit="cover"
                          removeRapper
                        />
                      }
                      {post?.postType === 'VALUATION' ? (
                        <>
                          <span
                            className={`${css.blur} ${
                              ['HOLD', 'PRE-BUZZ', 'BUZZ'].some(s => s === post.status) && css.show
                            }`}
                          />
                          <span className={css.net_worth}>
                            <CoinsIcon2 />
                            {numberFormat(post.netWorth, true)}
                          </span>
                        </>
                      ) : (
                        <span className={css.icon}>
                          {post?.postType === 'TOP10' ? (
                            <TopTenPostIcon />
                          ) : post?.isVideo ? (
                            <VideoFilledIcon />
                          ) : (
                            (post?.src.length || 1) > 1 && <MultiPostIcon />
                          )}
                        </span>
                      )}
                    </ButtonBase>
                  ))}
                </section>
              )
            })}
          </div>
        </ConditionalRender>
      </PullToRefresh>
      <ConditionalRender condition={isFetchingNextPage}>
        <div className={css.posts_section}>
          <section>
            {Array.from(Array(7).keys()).map(i => (
              <Skeleton key={i} variant="rectangular" width="100%" height="100%" animation="wave" />
            ))}
          </section>
        </div>
        <></>
      </ConditionalRender>
      <ExploreSearchScreen />
    </div>
  )
}

ExplorePage.Layout = HomeLayout

export default ExplorePage
