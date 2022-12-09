import { Skeleton, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'

import useGetGeneralPosts from '../../api-routes/posts/general/fetch-general-posts'
import useGetProfile from '../../api-routes/profile-queries/fetch-profile'
import GeneralPostIcon from '../../components/icons/general-post.icon'
import ProfileCard from '../../components/others-profile-card'
import OthersProfileWithRank from '../../components/others-profile-with-rank'
import BioPreviewPopup from '../../components/popups/bio-preview.popup'
import OthersProfileOptions from '../../components/popups/profile-more-options/others-profile-options'
import ReportsPopup from '../../components/popups/reports/reports.popup'
import ProfilePopups from '../../components/profile-popups'
import RankCard from '../../components/rank-card'
import DailyLoginRewardsScreen from '../../components/screens/daily-login-rewards'
import ConditionalRender from '../../components/ui/conditional-render'
import EmptyStateImage from '../../components/ui/empty-state-image'
import GeneralPostPreviewCard from '../../components/ui/general-post/preview-card'
import { OthersOngoingPost } from '../../components/ui/ongoing-post/ongoing-post'
import { NoOfGeneralPost } from '../../components/ui/profile-counts'
import TopTenPostInProfile from '../../components/ui/top10-post-in-profile'
import ValuationPostInProfile from '../../components/ui/ValuationPost/ValuationPostInProfile'
import ValuedPostInProfile from '../../components/ui/ValuationPost/ValuedPostInProfile'
import { ProfileContext } from '../../contexts/profile.context'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'
import layoutCSS from '../../styles/layout.module.scss'
import css from '../../styles/profile-card.module.scss'
import { TitleBar } from '../profile'

const OthersProfile = () => {
  const [isMobile, router] = [useMediaQuery('(max-width: 900px)'), useRouter()]

  const [username, setUsername] = useState((router.query?.username || '').toString())

  usePageTitle({ title: username })

  useEffect(() => {
    setUsername((router.query?.username || '').toString())
  }, [router.query])

  return (
    <>
      <div className={layoutCSS['profile-bg']}>
        <div className={layoutCSS['profile-layout']}>
          <div className={layoutCSS['profile-card-wrapper']}>
            {isMobile ? (
              <OthersProfileWithRank username={username} />
            ) : (
              <>
                <ProfileCard username={username} />
                <RankCard username={username} />
              </>
            )}
          </div>
        </div>
        <div>
          <OthersProfilePosts username={username} />
        </div>
      </div>
      <ProfilePopups username={username} />
    </>
  )
}

const OthersProfilePage = () => {
  const { profile } = useContext(ProfileContext)
  const router = useRouter()

  const { data, isLoading } = useGetProfile((router.query?.username as string) || '', false)

  useLayoutEffect(() => {
    if (router.query?.username === profile.username) router.replace('/profile')
  }, [profile.username, router, router.query])

  return (
    <ConditionalRender condition={router.query?.username === profile.username || isLoading}>
      <div style={{ display: 'grid', placeItems: 'center', height: '70vh' }}>
        <span>Loading...</span>
      </div>
      <ConditionalRender condition={!data?._id}>
        <div style={{ display: 'grid', placeItems: 'center', height: '70vh' }}>
          <h3>User not found</h3>
        </div>
        <OthersProfile />
      </ConditionalRender>
    </ConditionalRender>
  )
}

OthersProfilePage.Layout = HomeLayout

export default OthersProfilePage

const OthersProfilePosts = ({ username }: { username: string }) => {
  const router = useRouter()

  usePageTitle({ title: username })

  const { data, isLoading } = useGetGeneralPosts({ username })

  const viewGeneralPost = (postId: string) => () => {
    router.push(`/${username}/posts/general/view?post=${postId}`)
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <OthersOngoingPost username={username} />
      <ValuationPostInProfile username={username} />
      <ValuedPostInProfile username={username} />
      <TopTenPostInProfile username={username} isOwnProfile={false} />
      <div className={css['post-container-root-wrapper']}>
        <TitleBar
          title={
            <>
              General Posts <NoOfGeneralPost username={username} />
            </>
          }
          icon={<GeneralPostIcon />}
          link={`/${username}/posts/general`}
          showSeeAll={data !== undefined && (data?.pages?.[0]?.length || 0) > 9}
        />
        <div className={css['post-container-wrapper']}>
          <div className={css['post-container']}>
            {isLoading ? (
              <>
                <Skeleton variant="rectangular" width={'100%'} height={220} />
                <Skeleton variant="rectangular" width={'100%'} height={220} />
                <Skeleton variant="rectangular" width={'100%'} height={220} />
              </>
            ) : !data || (data?.pages?.[0]?.length || 0) === 0 ? (
              <EmptyStateImage />
            ) : (
              data?.pages?.[0]
                ?.slice(0, 10)
                .map(post => (
                  <GeneralPostPreviewCard
                    key={post._id}
                    isVideo={post.isVideo}
                    onClick={viewGeneralPost(post._id)}
                    postId={post._id}
                    src={post.isVideo ? post.thumbnail : post.src[0]}
                    isMultiPost={post.src.length > 1}
                  />
                ))
            )}
            <span className={css['overflow-fix']} />
          </div>
        </div>
      </div>
      <OthersProfileOptions />
      <ReportsPopup />
      <BioPreviewPopup />
      <DailyLoginRewardsScreen />
    </div>
  )
}
