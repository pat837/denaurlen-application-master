import useGetValuationPosts from '../../api-routes/posts/valuation/get-valuation-posts'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import css from '../../styles/pages/valuation/valuation-post.page.module.scss'
import ValuationPostCard from '../ui/valuation-post/valuation-post-card'

type ValuationPostScreenProps_ = {
  username: string
}
type ValuationOnGoingProps_ = {
  username: string
}

const ValuationPosts = ({ username }: ValuationOnGoingProps_) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetValuationPosts({
    username,
    size: 10
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

        return page.map(({ highestValuer, ...post }, indx) => (
          <div key={`${post._id}_${indx}`} ref={isLastPage && indx === 6 ? nextPageTrigger : undefined}>
            <ValuationPostCard highestValuer={highestValuer._id} {...post} />
          </div>
        ))
      })}
    </div>
  )
}

const ValuationPostScreen = ({ username }: ValuationPostScreenProps_) => {
  return (
    <div className={css.wrapper}>
      <div className={css.main}>
        <ValuationPosts username={username} />
      </div>
    </div>
  )
}

export default ValuationPostScreen
