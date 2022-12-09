import router from 'next/router'
import { Fragment, useEffect } from 'react'

import useGetSavedPost from '../../../../api-routes/posts/general/fetch-saved-posts'
import EmptyStateForPosts from '../../../../components/ui/empty-state-for-posts'
import GeneralPostCard from '../../../../components/ui/general-post/card'
import LeaderboardSection from '../../../../components/ui/leaderboard-section'
import useFetchNextPage from '../../../../hooks/fetch-next-page.hook'
import usePageTitle from '../../../../hooks/page-title.hook'
import HomeLayout from '../../../../layouts/home.layout'
import css from '../../../../styles/pages/general/post.module.scss'

const SavedPostsViewPage = () => {
  const { data: posts, isError, isFetching, fetchNextPage, isLoading, hasNextPage } = useGetSavedPost()

  const refreshTrigger = useFetchNextPage({
    fetchNextPage,
    isLoading: isFetching || isLoading,
    hasNextPage: hasNextPage || false
  })

  usePageTitle({ title: 'Saved Posts' })

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

  if (isLoading) return <p>Loading...</p>

  if (isError && posts === undefined) return <p>Error while fetching data..</p>

  if (!posts?.pages?.[0]?.[0])
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
          {posts.pages.map((page, pageNo) => {
            const isLastPage = posts.pages.length === pageNo + 1

            return page.map((post, index) => (
              <Fragment key={post._id}>
                <span id={post._id} ref={isLastPage && index === 15 ? refreshTrigger : undefined} />
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

SavedPostsViewPage.Layout = HomeLayout

export default SavedPostsViewPage
