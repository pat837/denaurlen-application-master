import useFetchHoldPosts from '../../api-routes/posts/valuation/get-hold-posts'
import css from '../../styles/pages/valuation/valuation-post.page.module.scss'
import ValuationPostCard from '../ui/valuation-post/valuation-post-card'

const HoldPosts = () => {
  const { data } = useFetchHoldPosts()

  return (
    <div className={css.post_wrapper}>
      {data?.map((post, indx) => (
        <div key={`${post._id}_${indx}`} id={post._id}>
          <ValuationPostCard {...post} />
        </div>
      ))}
    </div>
  )
}

const HoldPostScreen = () => {
  return (
    <div className={css.wrapper}>
      <div className={css.main}>
        <HoldPosts />
      </div>
    </div>
  )
}

export default HoldPostScreen
