import { Skeleton } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useContext } from 'react'

import useGetGeneralPosts from '../../api-routes/posts/general/fetch-general-posts'
import useIsValuationUnlock from '../../api-routes/posts/valuation/is-valuation-unlock'
import useGetReferralCount from '../../api-routes/settings/get-referral-count'
import GeneralPostIcon from '../../components/icons/general-post.icon'
import ProfileOptions from '../../components/popups/profile-more-options/profile-options'
import EmptyStateImage from '../../components/ui/empty-state-image'
import GeneralPostPreviewCard from '../../components/ui/general-post/preview-card'
import FollowingOngoingPost from '../../components/ui/ongoing-post/following-ongoing'
import OngoingPost from '../../components/ui/ongoing-post/ongoing-post'
import { NoOfGeneralPost } from '../../components/ui/profile-counts'
import TopTenPostInProfile from '../../components/ui/top10-post-in-profile'
import ValuationPostInProfile from '../../components/ui/ValuationPost/ValuationPostInProfile'
import ValuedPostInProfile from '../../components/ui/ValuationPost/ValuedPostInProfile'
import { ProfileContext } from '../../contexts/profile.context'
import usePageTitle from '../../hooks/page-title.hook'
import Layout from '../../layouts/profile-page.layout'
import css from '../../styles/profile-card.module.scss'

export type TitleBarProps = {
  title: string | ReactNode
  icon: ReactNode
  link: string
  showSeeAll?: boolean
  onClick?: () => any
}

export const TitleBar = ({ title, icon, link, showSeeAll = false, onClick = () => {} }: TitleBarProps) => (
  <div className={css['post-title-bar']}>
    <div>
      {icon}
      <h4>{title}</h4>
    </div>
    {showSeeAll && (
      <Link href={link} passHref>
        <a onClick={onClick}>See all</a>
      </Link>
    )}
  </div>
)

const ReferralCount = () => {
  useGetReferralCount()
  return <></>
}

const ProfilePage = () => {
  const [router, { profile }] = [useRouter(), useContext(ProfileContext)]

  usePageTitle({ title: profile.username, hideBackButton: true })

  const { data: generalPosts, isLoading } = useGetGeneralPosts({
    username: profile.username,
    size: 30
  })

  const { data: unlockCriteria } = useIsValuationUnlock()

  const viewGeneralPost = (postId: string) => () => {
    router.push(`/profile/general/posts?post=${postId}`)
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <ReferralCount />
      <OngoingPost />
      {!unlockCriteria?.data || <ValuationPostInProfile username={profile.username} />}
      <ValuedPostInProfile username={profile.username} />
      <FollowingOngoingPost username={profile.username} />
      <TopTenPostInProfile username={profile.username} isOwnProfile />
      <div className={css['post-container-root-wrapper']}>
        <TitleBar
          title={
            <>
              General Posts <NoOfGeneralPost username={profile.username} />
            </>
          }
          icon={<GeneralPostIcon />}
          link={'/profile/general'}
          showSeeAll={generalPosts !== undefined && generalPosts?.pages?.[0]?.length > 9}
        />
        <div className={css['post-container-wrapper']}>
          <div className={css['post-container']}>
            {isLoading ? (
              <>
                <Skeleton variant="rectangular" width={'100%'} height={220} />
                <Skeleton variant="rectangular" width={'100%'} height={220} />
                <Skeleton variant="rectangular" width={'100%'} height={220} />
              </>
            ) : !generalPosts || generalPosts?.pages?.[0]?.length === 0 ? (
              <EmptyStateImage type="GENERAL" />
            ) : (
              generalPosts.pages.map(page =>
                page
                  ?.slice(0, 10)
                  ?.map(({ _id, src, ...post }) => (
                    <GeneralPostPreviewCard
                      key={_id}
                      isVideo={post.isVideo}
                      onClick={viewGeneralPost(_id)}
                      postId={_id}
                      src={post.isVideo ? post.thumbnail : src[0]}
                      isMultiPost={src.length > 1}
                    />
                  ))
              )
            )}
            <span className={css['overflow-fix']} />
          </div>
        </div>
      </div>
      <ProfileOptions />
    </div>
  )
}

ProfilePage.Layout = Layout

export default ProfilePage
