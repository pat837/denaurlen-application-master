import useGetFollowingOngoingPost from '../../api-routes/posts/valuation/following-ongoing-post'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import css from '../../styles/pages/valuation/valuation-post.page.module.scss'
import ValuationPostCard from '../ui/valuation-post/valuation-post-card'

const FollowingOngoingPosts = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetFollowingOngoingPost()
  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  return (
    <div className={css.post_wrapper}>
      {data?.pages.map((page, pageNo) => {
        const isLastPage = data.pages.length === pageNo + 1

        return page.posts.map(({ highestValuer, ...post }, indx) => (
          <div key={`${post._id}_${indx}`} ref={isLastPage && indx === 6 ? nextPageTrigger : undefined}>
            <ValuationPostCard {...post} highestValuer={highestValuer._id} />
          </div>
        ))
      })}
    </div>
  )
}

const FollowingOngoingPostScreen = () => {
  return (
    <div className={css.wrapper}>
      <div className={css.main}>
        <FollowingOngoingPosts />
      </div>
    </div>
  )
}

export default FollowingOngoingPostScreen
