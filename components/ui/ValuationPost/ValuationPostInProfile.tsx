import css from '../../../styles/profile-card.module.scss'

import { Skeleton } from '@mui/material'
import { useContext } from 'react'

import useGetValuationPosts from '../../../api-routes/posts/valuation/get-valuation-posts'
import { ProfileContext } from '../../../contexts/profile.context'
import { TitleBar } from '../../../pages/profile'
import ValuationPostIcon from '../../icons/valuationPostIcon'
import EmptyStateImage from '../empty-state-image'
import ValuationPreviewCard from '../valuation-post/valuation-preview-card'

const ValuationPostInProfile = ({ username }: { username: string }) => {
  const { profile } = useContext(ProfileContext)

  const { data, isLoading } = useGetValuationPosts({
    username,
    size: 10
  })

  if (username !== profile.username && !isLoading && (data?.pages[0]?.length || 0) === 0) return <></>

  return (
    <div className={css['post-container-root-wrapper']}>
      <TitleBar
        title={<>Valuation Collection</>}
        icon={<ValuationPostIcon />}
        link="profile/valuation/view"
        showSeeAll={(!data?.pages[0]?.length || 0) > 9}
      />
      <div className={css['post-container-wrapper']}>
        <div className={css['post-container']}>
          {isLoading || !data?.pages?.length ? (
            Array.from(Array(10).keys()).map(index => (
              <Skeleton
                key={`loading-indicator-${index}`}
                variant="rectangular"
                width="100%"
                height="100%"
                style={{ aspectRatio: '8 / 10', borderRadius: 10 }}
              />
            ))
          ) : !data.pages[0]?.length ? (
            <EmptyStateImage type={profile.username === username ? 'VALUATION' : undefined} />
          ) : (
            data.pages.map(group =>
              group.map(post => <ValuationPreviewCard key={post._id} username={username} {...post} />)
            )
          )}
          <span className={css['overflow-fix']} />
        </div>
      </div>
    </div>
  )
}

export default ValuationPostInProfile
