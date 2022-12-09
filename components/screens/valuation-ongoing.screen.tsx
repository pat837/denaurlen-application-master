import useGetOngoingValuationPosts from '../../api-routes/posts/valuation/get-valuation-ongoing'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import css from '../../styles/pages/valuation/valuation-post.page.module.scss'
import ValuationPostCard from '../ui/valuation-post/valuation-post-card'

type ValuationPostScreenProps_ = {
  username: string
}
type ValuationOnGoingProps_ = {
  username: string
}

const OngoingValuationPosts = ({ username }: ValuationOnGoingProps_) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetOngoingValuationPosts({
    username
  })
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

const OngoingValuationPostScreen = ({ username }: ValuationPostScreenProps_) => {
  return (
    <div className={css.wrapper}>
      <div className={css.main}>
        <OngoingValuationPosts username={username} />
      </div>
    </div>
  )
}

export default OngoingValuationPostScreen
