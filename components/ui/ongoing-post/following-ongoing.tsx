import styles from './ongoing-post.module.scss'
import css from '../../../styles/profile-card.module.scss'

import router from 'next/router'
import ValuationPreviewCard from '../valuation-post/valuation-preview-card'
import useGetFollowingOngoingPost from '../../../api-routes/posts/valuation/following-ongoing-post'

type OngoingPostProps_ = {
  username: string
}

const FollowingOngoingInProfile = ({ username }: OngoingPostProps_) => {
  const { data } = useGetFollowingOngoingPost()

  const onSeeAll = () => router.push(`/profile/following-on-going`)

  if (!data?.pages?.[0]?.posts?.length) return <></>

  const title = (
    <div className={styles.title}>
      <div>
        <h5>
          Followings Ongoing&nbsp;&nbsp;|&nbsp;&nbsp;
          <span>Valuation</span>
        </h5>
      </div>
      <a onClick={onSeeAll}>See all</a>
    </div>
  )

  return (
    <div className={styles.wrapper}>
      {title}
      <div className={css['post-container-root-wrapper']}>
        <div className={css['post-container-wrapper']}>
          <div className={css['post-container']}>
            {data?.pages.map((page, pageNo) =>
              page.posts.map(post => (
                <ValuationPreviewCard
                  isFollowings
                  key={post._id}
                  username={username}
                  {...post}
                  showPost={data.pages[pageNo].views?.some(view => {
                    return view?.postId === post._id
                  })}
                />
              ))
            )}
            <span className={css['overflow-fix']} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FollowingOngoingInProfile
