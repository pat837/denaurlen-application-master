import { Skeleton } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useContext, useRef } from 'react'

import useFetchGeneralPosts from '../../../api-routes/posts/general/fetch-general-posts'
import DotLoader from '../../../components/ui/dot-loader'
import EmptyStateForPosts from '../../../components/ui/empty-state-for-posts'
import GeneralPostPreviewCard from '../../../components/ui/general-post/preview-card'
import { ProfileContext } from '../../../contexts/profile.context'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'
import css from '../../../styles/general-post-page.module.scss'

import type { GeneralPost_ } from '../../../types/general-post.types'

const PostWrapper = ({ children }: { children: ReactNode }) => <div className={css['post-wrapper']}>{children}</div>

const PageWrapper = ({ children }: { children: ReactNode }) => <div className={css['page-wrapper']}>{children}</div>

const GeneralPostsPage = () => {
  const [router, { profile }] = [useRouter(), useContext(ProfileContext)]

  usePageTitle({ title: 'General Post' })

  const {
    data: generalPosts,
    isLoadingError,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useFetchGeneralPosts({
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

  const clickHandlerForPost = (post: GeneralPost_) => () => {
    router.push(`/profile/general/posts?post=${post._id}`)
  }

  if (isLoading)
    return (
      <PageWrapper>
        <PostWrapper>
          <Skeleton variant="rectangular" animation="wave" />
          <Skeleton variant="rectangular" animation="wave" />
          <Skeleton variant="rectangular" animation="wave" />
          <Skeleton variant="rectangular" animation="wave" />
          <Skeleton variant="rectangular" animation="wave" />
          <Skeleton variant="rectangular" animation="wave" />
          <Skeleton variant="rectangular" animation="wave" />
          <Skeleton variant="rectangular" animation="wave" />
          <Skeleton variant="rectangular" animation="wave" />
        </PostWrapper>
      </PageWrapper>
    )

  if (isLoadingError && generalPosts === undefined)
    return (
      <PageWrapper>
        <p>Error while fetching data...</p>
      </PageWrapper>
    )

  if (generalPosts?.pages.length === 0 || generalPosts?.pages[0].length === 0)
    return (
      <PageWrapper>
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
      </PageWrapper>
    )

  return (
    <PageWrapper>
      <PostWrapper>
        {generalPosts?.pages.map((page, index) => {
          const isLastPage = index + 1 === generalPosts.pages.length
          return page.map((post, index) => (
            <div ref={isLastPage && index === 20 ? lastPostCardRef : undefined} key={post._id}>
              <GeneralPostPreviewCard
                isVideo={post.isVideo}
                onClick={clickHandlerForPost(post)}
                postId={post._id}
                src={post.isVideo ? post.thumbnail : post.src[0]}
                isMultiPost={post.src.length > 1}
              />
            </div>
          ))
        })}
      </PostWrapper>
      {isFetchingNextPage && (
        <div className={css['loader-wrapper']}>
          <DotLoader />
        </div>
      )}
    </PageWrapper>
  )
}

GeneralPostsPage.Layout = HomeLayout

export default GeneralPostsPage
