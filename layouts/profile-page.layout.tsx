import { useMediaQuery } from '@mui/material'
import { ReactNode, useContext } from 'react'
import { useSelector } from 'react-redux'

import useGetFollowingOngoingPost from '../api-routes/posts/valuation/following-ongoing-post'
import useGetOngoingValuationPosts from '../api-routes/posts/valuation/get-valuation-ongoing'
import useGetOngoingValuedPosts from '../api-routes/posts/valuation/get-valued-ongoing'
import useGetValuedPosts from '../api-routes/posts/valuation/get-valued-post'
import useIsValuationUnlock from '../api-routes/posts/valuation/is-valuation-unlock'
import ChangeProfilePic from '../components/forms/change-profile-pic'
import EditProfileForm from '../components/forms/edit-profile'
import ConfirmFollowPopup from '../components/popups/confirm-popup/confirm-follow.popup'
import ConfirmUnFollowPopup from '../components/popups/confirm-popup/confirm-unfollow.popup'
import FollowerFollowingPopup from '../components/popups/follower-following/followers-following.popup'
import ProfileCard from '../components/profile-card'
import ProfileCardWithRank from '../components/profile-card-with-rank'
import ProfilePopups from '../components/profile-popups'
import RankCard from '../components/rank-card'
import DailyLoginRewardsScreen from '../components/screens/daily-login-rewards'
import { ProfileContext } from '../contexts/profile.context'
import css from '../styles/layout.module.scss'
import HomeLayout from './home.layout'

import type { storeType } from '../types'
import BioPreviewPopup from '../components/popups/bio-preview.popup'

const ProfilePageLayout = ({ children }: { children: ReactNode }) => {
  const isMobile = useMediaQuery('(max-width: 900px)')

  const {
    refetchProfile: refetch,
    profile: { username }
  } = useContext(ProfileContext)
  const { editProfile } = useSelector((store: storeType) => store.profilePage)

  const { isLoading: isLoadingValuationPosts } = useGetOngoingValuationPosts({ username })
  const { isLoading: isLoadingValuedPost } = useGetOngoingValuedPosts({ username, size: 10 })
  const { isLoading: isLoadingValuationUnlock } = useIsValuationUnlock()
  const { isLoading: isLoadingValued } = useGetValuedPosts({ username, size: 10 })
  const { isLoading: isLoadingFollowingOngoing } = useGetFollowingOngoingPost()

  return (
    <HomeLayout>
      <div className={css['profile-bg']}>
        <div className={css['profile-layout']}>
          <div className={css['profile-card-wrapper']}>
            {isMobile ? (
              <ProfileCardWithRank />
            ) : (
              <>
                <ProfileCard />
                <RankCard username={username} />
              </>
            )}
          </div>
        </div>
        <div>{children}</div>
        <div
          className={`${css.loader} ${
            isLoadingFollowingOngoing ||
            isLoadingValuationPosts ||
            isLoadingValuationUnlock ||
            isLoadingValued ||
            isLoadingValuedPost ||
            css.hide
          }`}
        >
          <span>Fetching details...</span>
        </div>
      </div>
      <ProfilePopups username={username} />
      <FollowerFollowingPopup username={username} />
      {!!editProfile.username && <EditProfileForm refetch={refetch} />}
      {!!editProfile.username && <ChangeProfilePic refetch={refetch} />}
      <ConfirmFollowPopup />
      <ConfirmUnFollowPopup />
      <DailyLoginRewardsScreen />
      <BioPreviewPopup />
    </HomeLayout>
  )
}

export default ProfilePageLayout
