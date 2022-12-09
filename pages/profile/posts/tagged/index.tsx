import { Skeleton } from '@mui/material'
import router from 'next/router'
import { ReactNode } from 'react'

import useGetTaggedPost from '../../../../api-routes/posts/general/fetch-tagged-posts'
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

const TaggedPostsPage = () => {
  usePageTitle({ title: 'Tagged Posts' })

  const {
    data: posts,
    isError,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage
  } = useGetTaggedPost(25)

  const refreshTrigger = useFetchNextPage({
    fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false
  })

  const clickHandlerForPost = (postId: string) => () => {
    router.push(`/profile/posts/tagged/view?post=${postId}`)
  }

  if (isLoading && posts === undefined)
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

  if (!posts?.pages.length || !posts.pages[0].length)
    return (
      <PageWrapper>
        <EmptyStateForPosts
          text={
            <p>
              {' '}
              When you are tagged to general(normal) post
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
        {posts.pages.map((page, pageNo) => {
          const isLastPage = posts.pages.length === pageNo + 1

          return page.map((post, index) => (
            <GeneralPostPreviewCard
              key={post._id}
              isVideo={post.isVideo}
              postId={post._id}
              onClick={clickHandlerForPost(post._id)}
              ref={isLastPage && index === 15 ? refreshTrigger : undefined}
              src={post.isVideo ? post.thumbnail : post.src[0]}
              isMultiPost={post.src.length > 1}
            />
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

TaggedPostsPage.Layout = HomeLayout

export default TaggedPostsPage
