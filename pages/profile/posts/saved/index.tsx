import { Skeleton } from '@mui/material'
import router from 'next/router'
import { ReactNode } from 'react'

import useGetSavedPost from '../../../../api-routes/posts/general/fetch-saved-posts'
import DotLoader from '../../../../components/ui/dot-loader'
import EmptyStateForPosts from '../../../../components/ui/empty-state-for-posts'
import GeneralPostPreviewCard from '../../../../components/ui/general-post/preview-card'
import useFetchNextPage from '../../../../hooks/fetch-next-page.hook'
import usePageTitle from '../../../../hooks/page-title.hook'
import HomeLayout from '../../../../layouts/home.layout'
import css from '../../../../styles/general-post-page.module.scss'

const PostWrapper = ({ children }: { children: ReactNode }) => (
  <div className={css['post-wrapper']}>{children}</div>
)

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <div className={css['page-wrapper']}>{children}</div>
)

const SavedPostsPage = () => {
  usePageTitle({ title: 'Saved Posts' })

  const { data: posts, isError, isFetching, fetchNextPage, hasNextPage, isLoading } = useGetSavedPost()

  const refetchTriggerRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isLoading || isFetching
  })

  const clickHandlerForPost = (postId: string) => () => {
    router.push(`/profile/posts/saved/view?post=${postId}`)
  }

  if (isLoading)
    return (
      <PageWrapper>
        <PostWrapper>
          {Array.from(Array(9).keys()).map(i => (
            <Skeleton key={i} variant="rectangular" animation="wave" />
          ))}
        </PostWrapper>
      </PageWrapper>
    )

  if (isError && posts === undefined)
    return (
      <PageWrapper>
        <p>Error while fetching data...</p>
      </PageWrapper>
    )

  if (posts?.pages?.length === 0 || posts?.pages?.[0]?.length === 0)
    return (
      <PageWrapper>
        <EmptyStateForPosts
          text={
            <p>
              {' '}
              When you save a general(normal) post
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
        {posts?.pages.map((page, pageNo) => {
          const isLastPage = (posts.pages.length = pageNo + 1)

          return page.map((post, index) => (
            <GeneralPostPreviewCard
              key={post._id}
              isVideo={post.isVideo}
              onClick={clickHandlerForPost(post._id)}
              postId={post._id}
              ref={isLastPage && index === 15 ? refetchTriggerRef : undefined}
              src={post.isVideo ? post.thumbnail : post.src[0]}
              isMultiPost={post.src.length > 1}
            />
          ))
        })}
      </PostWrapper>
      {isFetching && (
        <div className={css['loader-wrapper']}>
          <DotLoader />
        </div>
      )}
    </PageWrapper>
  )
}

SavedPostsPage.Layout = HomeLayout

export default SavedPostsPage
