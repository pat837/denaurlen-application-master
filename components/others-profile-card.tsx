import { Avatar, ButtonBase, IconButton, Skeleton } from '@mui/material'
import Head from 'next/head'
import { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useGetProfile from '../api-routes/profile-queries/fetch-profile'
import { appbarActions, profilePageActions } from '../data/actions'
import useBioPopupHandler from '../hooks/open-bio-popup.hook'
import usePopup from '../hooks/popup.hook'
import css from '../styles/profile-card.module.scss'
import { storeType } from '../types'
import { getMediaURL } from '../utils/get-url'
import MoreHorizontalIcon from './icons/more-horizontal.icon'
import RoyalTick from './icons/royal-tick'
import AvatarRing from './ui/avatar-ring'
import { OthersBalanceCount as BalanceCount } from './ui/balance-info'
import { FollowButton } from './ui/follow-buttons'
import MessageButton from './ui/message-button'
import { CommunityCount, FollowingCount, MyCommunityCount, NoOfFollowers, NoOfPost } from './ui/profile-counts'

export const ProfileCardLoader = () => (
  <div className={css.wrapper}>
    <Skeleton variant="text" width="100%" />
    <div className={css.profile_wrapper}>
      <Skeleton variant="circular" width={80} height={80}>
        <Avatar />
      </Skeleton>
      <Skeleton variant="rectangular" height={75} width={'80%'} />
    </div>
    <Skeleton variant="text" width="100%" />
  </div>
)

const OtherProfileCard = ({ username }: { username: string }) => {
  const [dispatch, { data: user, isLoading }, { openPopup }, options] = [
    useDispatch(),
    useGetProfile(username, false),
    usePopup(),
    useSelector((store: storeType) => store.systemOptions)
  ]

  useLayoutEffect(() => {
    if (!user || isLoading) return
    dispatch(appbarActions.setTitle(user.username))
  }, [user, isLoading, dispatch])

  const openBioPopup = useBioPopupHandler(user?.bio ?? { meaning: '', name: '', src: '' })

  if (isLoading || !user) return <ProfileCardLoader />

  const openFollowers = () => dispatch(profilePageActions.openFollowers())
  const openCommunity = () => dispatch(profilePageActions.openCommunity())
  const openFollowing = () => dispatch(profilePageActions.openFollowing())
  const openMyCommunity = () => dispatch(profilePageActions.openMyCommunity())
  const openMoreOptions = () => openPopup('profile-options', { params: { userId: user?._id } })

  return (
    <div className={css.wrapper}>
      <Head>
        <title>{!user?.name ? 'Profile' : user?.name} | DENAURLEN</title>
      </Head>
      {!options?.ambientBio || (
        <div
          className={css.bio_background}
          style={{ backgroundImage: `url('${getMediaURL(user?.bio?.src ?? '')}')` }}
        />
      )}
      <div className={css.username_wrapper}>
        <p className={css.username}>
          <span>{user?.username}</span>
          {user?.isVerified && <RoyalTick />}
        </p>
        <div>
          <FollowButton username={user.username} userId={user._id} />
          <div style={{ display: 'inline-block', width: '14px' }} />
          <MessageButton profileId={user._id} />
          <div style={{ display: 'inline-block', width: '14px' }} />
          <IconButton aria-label="more-option" onClick={openMoreOptions}>
            <MoreHorizontalIcon />
          </IconButton>
        </div>
      </div>
      <div className={css.profile_wrapper}>
        <AvatarRing showStories size={126} url={user?.profilePic} title={user.name} username={user.username} />
        <div className={css.follower_wrapper}>
          <div className={css.box} style={{ cursor: 'default' }}>
            <span>Posts</span>
            <p>
              <NoOfPost username={user.username} />
            </p>
          </div>
          <ButtonBase className={css.box} onClick={openFollowers}>
            <span>Followers</span>
            <p>
              <NoOfFollowers username={user.username} />
            </p>
          </ButtonBase>
          <ButtonBase className={css.box} onClick={openFollowing}>
            <span>Following</span>
            <p>
              <FollowingCount username={user.username} />
            </p>
          </ButtonBase>
          <ButtonBase className={css.box} onClick={openMyCommunity}>
            <span>My Community</span>
            <p>
              <MyCommunityCount username={user.username} />
            </p>
          </ButtonBase>
          <ButtonBase className={css.box} onClick={openCommunity}>
            <span>Community</span>
            <p>
              <CommunityCount username={user.username} />
            </p>
          </ButtonBase>
        </div>
      </div>
      <div className={css.bio_wrapper}>
        <div>
          <p className={css.name}>{user?.name}</p>
          <p className={css.bio} role="button" onClick={openBioPopup}>
            {user?.bio.name || ''}
          </p>
        </div>
        <BalanceCount username={username} />
      </div>
    </div>
  )
}

export default OtherProfileCard
