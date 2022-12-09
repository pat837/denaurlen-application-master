import useGetValuedPosts from '../../api-routes/posts/valuation/get-valued-post'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import css from '../../styles/pages/valuation/valuation-post.page.module.scss'
import ValuedPostCard from '../ui/valuation-post/valuation-post-card'

type ValuedPostScreenProps_ = {
  username: string
}
type ValuedOnGoingProps_ = {
  username: string
}

const ValuedOnGoing = ({ username }: ValuedOnGoingProps_) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetValuedPosts({
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
            <ValuedPostCard {...post} highestValuer={highestValuer._id} />
          </div>
        ))
      })}
    </div>
  )
}

const ValuedPostScreen = ({ username }: ValuedPostScreenProps_) => {
  return (
    <div className={css.wrapper}>
      <div className={css.main}>
        <ValuedOnGoing username={username} />
      </div>
    </div>
  )
}

export default ValuedPostScreen
