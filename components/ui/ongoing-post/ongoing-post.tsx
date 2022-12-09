import styles from './ongoing-post.module.scss'
import css from '../../../styles/profile-card.module.scss'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { ProfileContext } from '../../../contexts/profile.context'
import ValuationPreviewCard from '../valuation-post/valuation-preview-card'
import useGetOngoingValuationPosts from '../../../api-routes/posts/valuation/get-valuation-ongoing'
import useGetOngoingValuedPosts from '../../../api-routes/posts/valuation/get-valued-ongoing'

type OngoingPostProps_ = {
  username: string
}

const OngoingPost = () => {
  const { profile } = useContext(ProfileContext)
  const router = useRouter()

  const [{ tab }, setState] = useState<{
    tab: 'valuation' | 'valued'
  }>({
    tab: 'valuation'
  })

  const { data: valuationPosts } = useGetOngoingValuationPosts({ username: profile.username })
  const { data: valuedPosts } = useGetOngoingValuedPosts({ username: profile.username, size: 10 })

  const changeHandler = (tab: 'valued' | 'valuation') => () => {
    setState(s => ({ ...s, tab }))
  }

  const onSeeAll = (tab: 'valuation' | 'valued') => () => {
    router.push(`/profile/${tab}/on-going`)
  }

  useEffect(() => {
    if (!!valuationPosts?.pages?.[0]?.posts.length)
      setState(s => ({ ...s, tab: 'valuation', posts: valuationPosts }))
    else if (!!valuedPosts?.pages?.[0]?.length)
      setState(s => ({ ...s, tab: 'valued', posts: valuedPosts }))
  }, [valuationPosts, valuedPosts])

  if (!valuationPosts?.pages?.[0]?.posts.length && !valuedPosts?.pages?.[0]?.length) return <></>

  const title =
    !!valuationPosts?.pages?.[0]?.posts.length && !!valuedPosts?.pages?.[0]?.length ? (
      <div className={styles.title}>
        <div>
          <h5>
            Ongoing&nbsp;&nbsp;|&nbsp;&nbsp;
            <span
              role="button"
              onClick={changeHandler('valuation')}
              className={styles[tab === 'valuation' ? 'active' : '']}
            >
              Valuation
            </span>
            &nbsp; &nbsp;
            <span
              role="button"
              onClick={changeHandler('valued')}
              className={styles[tab === 'valued' ? 'active' : '']}
            >
              Valued
            </span>
          </h5>
        </div>
        <a onClick={onSeeAll(tab)}>See all</a>
      </div>
    ) : !!valuationPosts?.pages?.[0]?.posts.length ? (
      <div className={styles.title}>
        <div>
          <h5>
            Ongoing&nbsp;&nbsp;|&nbsp;&nbsp;
            <span role="button" onClick={changeHandler('valuation')}>
              Valuation
            </span>
          </h5>
        </div>
        <a onClick={onSeeAll('valuation')}>See all</a>
      </div>
    ) : (
      <div className={styles.title}>
        <div>
          <h5>
            Ongoing&nbsp;&nbsp;|&nbsp;&nbsp;
            <span role="button" onClick={changeHandler('valued')}>
              Valued
            </span>
          </h5>
        </div>
        <a onClick={onSeeAll('valued')}>See all</a>
      </div>
    )

  return (
    <div className={styles.wrapper}>
      {title}
      <div className={css['post-container-root-wrapper']}>
        <div className={css['post-container-wrapper']}>
          <div className={css['post-container']}>
            {tab === 'valuation'
              ? valuationPosts?.pages.map(page =>
                  page.posts.map(post => (
                    <ValuationPreviewCard
                      isOngoing
                      key={post._id}
                      username={profile.username}
                      {...post}
                    />
                  ))
                )
              : valuedPosts?.pages.map(page =>
                  page
                    .slice(0, 10)
                    .map(post => (
                      <ValuationPreviewCard
                        isOngoing
                        isValuedPost
                        key={post._id}
                        username={profile.username}
                        {...post}
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

const OthersOngoingPost = ({ username }: OngoingPostProps_) => {
  const router = useRouter()

  const { data } = useGetOngoingValuationPosts({ username: username, isOthers: true })

  const onSeeAll = () => {
    router.push(`/${username}/valuation/on-going`)
  }

  if (!data?.pages?.[0]?.posts?.length) return <></>

  const title = (
    <div className={styles.title}>
      <div>
        <h5>
          Ongoing&nbsp;&nbsp;|&nbsp;&nbsp;
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
            {data.pages.map((page, pageNo) =>
              page.posts.map(post => (
                <ValuationPreviewCard
                  isOngoing
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

export { OthersOngoingPost }
export default OngoingPost
