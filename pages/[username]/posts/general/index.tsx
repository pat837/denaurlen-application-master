import { Skeleton } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useRef } from 'react'

import useGetGeneralPosts from '../../../../api-routes/posts/general/fetch-general-posts'
import GeneralPostPreviewCard from '../../../../components/ui/general-post/preview-card'
import usePageTitle from '../../../../hooks/page-title.hook'
import HomeLayout from '../../../../layouts/home.layout'
import css from '../../../../styles/general-post-page.module.scss'

const PostWrapper = ({ children }: { children: ReactNode }) => <div className={css['post-wrapper']}>{children}</div>

const PageWrapper = ({ children }: { children: ReactNode }) => <div className={css['page-wrapper']}>{children}</div>

const OthersGeneralPostsPage = () => {
  const router = useRouter()

  const {
    data: generalPosts,
    isLoadingError,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useGetGeneralPosts({
    username: router.query?.username?.toString() || '',
    size: 30
  })

  usePageTitle({ title: 'General Posts' })

  const observer = useRef<any>()
  const nextPageTrigger = useCallback(
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

  const clickHandlerForPost = (postId: string) => () => {
    router.push(`/${router.query?.username?.toString() || ''}/posts/general/view?post=${postId}`)
  }

  if (isLoading)
    return (
      <PageWrapper>
        <PostWrapper>
          {Array.from(Array(12)).map(i => (
            <Skeleton key={`loader-${i}`} variant="rectangular" animation="wave" />
          ))}
        </PostWrapper>
      </PageWrapper>
    )

  if (isLoadingError)
    return (
      <PageWrapper>
        <p>Error while fetching data...</p>
      </PageWrapper>
    )

  return (
    <PageWrapper>
      <PostWrapper>
        {generalPosts?.pages.map((page, pageNo) => {
          const isLastPage = pageNo + 1 === generalPosts.pages.length

          return page.map((post, index) => (
            <div ref={isLastPage && index === 20 ? nextPageTrigger : undefined} key={post._id}>
              <GeneralPostPreviewCard
                isVideo={post.isVideo}
                onClick={clickHandlerForPost(post._id)}
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
          {Array.from(Array(6)).map(i => (
            <Skeleton key={`loader-${i}`} variant="rectangular" animation="wave" />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}

OthersGeneralPostsPage.Layout = HomeLayout

export default OthersGeneralPostsPage
