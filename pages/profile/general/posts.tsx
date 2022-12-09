import { useRouter } from 'next/router'
import { Fragment, useCallback, useContext, useEffect, useRef } from 'react'

import useGetGeneralPosts from '../../../api-routes/posts/general/fetch-general-posts'
import EmptyStateForPosts from '../../../components/ui/empty-state-for-posts'
import GeneralPostCard from '../../../components/ui/general-post/card'
import LeaderboardSection from '../../../components/ui/leaderboard-section'
import { ProfileContext } from '../../../contexts/profile.context'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'
import css from '../../../styles/pages/general/post.module.scss'

const GeneralPostsViewPage = () => {
  const [router, { profile }] = [useRouter(), useContext(ProfileContext)]

  usePageTitle({ title: 'General Posts' })

  useEffect(() => {
    const postId = router.query?.post

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    data: generalPosts,
    isLoadingError,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useGetGeneralPosts({
    username: profile.username,
    size: 30
  })

  // Pagination code
  const observer = useRef<any>()
  const lastPostCardRef = useCallback(
    (node: any) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  if (isLoading) return <p>Loading...</p>

  if (isLoadingError || !generalPosts?.pages?.length) return <p>Error while fetching data..</p>

  if (generalPosts.pages.length === 0 || generalPosts.pages[0].length === 0)
    return (
      <EmptyStateForPosts
        text={
          <p>
            {' '}
            When you post a general (normal)
            <br />
            photo it will appear here.
          </p>
        }
      />
    )

  return (
    <div className={css.page}>
      <div className={css.container}>
        <div className={css.wrapper}>
          {generalPosts.pages.map((page, index) => {
            const isLastPage = index + 1 === generalPosts.pages.length

            return page.map((post, index) => (
              <Fragment key={post._id}>
                <span ref={isLastPage && index === 20 ? lastPostCardRef : undefined} id={post._id} />
                <GeneralPostCard {...post} />
              </Fragment>
            ))
          })}
          <div style={{ height: 'calc(var(--root-padding) / 2)' }} />
        </div>
      </div>
      <div className={css.leaderboard}>
        <LeaderboardSection />
      </div>
    </div>
  )
}

GeneralPostsViewPage.Layout = HomeLayout

export default GeneralPostsViewPage
