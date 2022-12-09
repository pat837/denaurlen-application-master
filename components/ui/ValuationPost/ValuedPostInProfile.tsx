import { Skeleton } from '@mui/material'
import { useContext } from 'react'

import useGetValuedPosts from '../../../api-routes/posts/valuation/get-valued-post'
import { ProfileContext } from '../../../contexts/profile.context'
import { TitleBar } from '../../../pages/profile'
import css from '../../../styles/profile-card.module.scss'
import ValuationPostIcon from '../../icons/valuationPostIcon'
import ValuationPostPreviewCard from './../valuation-post/valuation-preview-card'

const ValuedPostInProfile = ({ username }: { username: string }) => {
  const { profile } = useContext(ProfileContext)

  const { data, isLoading } = useGetValuedPosts({
    username,
    size: 10
  })

  if (!isLoading && (data?.pages[0]?.length || 0) === 0) return <></>

  return (
    <div className={css['post-container-root-wrapper']}>
      <TitleBar
        title={<>Valued Collection</>}
        icon={<ValuationPostIcon />}
        link={`${username === profile.username ? 'profile' : username}/valued/view`}
        showSeeAll={(!data?.pages[0]?.length || 0) > 9}
      />
      <div className={css['post-container-wrapper']}>
        <div className={css['post-container']}>
          {isLoading
            ? Array.from(Array(10).keys()).map(index => (
                <Skeleton
                  key={`loading-indicator-${index}`}
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  style={{ aspectRatio: '8 / 10', borderRadius: 10 }}
                />
              ))
            : data?.pages.map(group =>
                group.map(post => (
                  <ValuationPostPreviewCard username={username} isValuedPost {...post} key={post._id} />
                ))
              )}
          <span className={css['overflow-fix']} />
        </div>
      </div>
    </div>
  )
}

export default ValuedPostInProfile
