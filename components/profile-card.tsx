import { Avatar, ButtonBase, IconButton, Skeleton } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ProfileContext } from '../contexts/profile.context'
import { appbarActions, profilePageActions } from '../data/actions'
import useBioPopupHandler from '../hooks/open-bio-popup.hook'
import usePopup from '../hooks/popup.hook'
import css from '../styles/profile-card.module.scss'
import { storeType } from '../types'
import { getMediaURL } from '../utils/get-url'
import MoreHorizontalIcon from './icons/more-horizontal.icon'
import RoyalTick from './icons/royal-tick'
import AvatarRing from './ui/avatar-ring'
import { BalanceCount } from './ui/balance-info'
import Button from './ui/button'
import { CommunityCount, FollowingCount, MyCommunityCount, NoOfFollowers, NoOfPost } from './ui/profile-counts'
import Text from './ui/text-with-loader'

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

const ProfileCard = () => {
  const { profile: user, isLoading, refetchProfile } = useContext(ProfileContext)
  const dispatch = useDispatch()
  const router = useRouter()
  const { openPopup } = usePopup()
  const options = useSelector((store: storeType) => store.systemOptions)
  const openBioPopup = useBioPopupHandler(user.bio)

  useEffect(() => {
    refetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!user || isLoading) return
    dispatch(appbarActions.setTitle(user.username))
  }, [user, isLoading, dispatch])

  const openOptions = () => openPopup('profile-options')
  const openFollowers = () => dispatch(profilePageActions.openFollowers())
  const openCommunity = () => dispatch(profilePageActions.openCommunity())
  const openFollowing = () => dispatch(profilePageActions.openFollowing())
  const openMyCommunity = () => dispatch(profilePageActions.openMyCommunity())
  const handleUpdateBios = () => router.push('/bios')

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
          <span>
            <Text text={user.username} loading={isLoading} />
          </span>
          {user?.isVerified && <RoyalTick />}
        </p>
        <IconButton data-edit-button aria-label="profile-options" onClick={openOptions}>
          <MoreHorizontalIcon />
        </IconButton>
      </div>
      <div className={css.profile_wrapper}>
        <AvatarRing showStories size={126} url={user?.profilePic} title={user.name} username={user.username} />
        <div className={css.follower_wrapper}>
          <div className={css.box} style={{ cursor: 'default' }}>
            <span>Post</span>
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
          <p className={css.name}>
            <Text text={user.name} loading={isLoading} />
          </p>
          <p className={css.bio}>
            Bio:&nbsp;
            {(!!user?.bio?.name ? (
              <span role="button" onClick={openBioPopup}>
                {user?.bio?.name}
              </span>
            ) : (
              <Button label="add bio" variant="text" removePadding onClick={handleUpdateBios} />
            )) || <Text text={user.bio.name} loading={isLoading} />}
          </p>
        </div>
        <BalanceCount />
      </div>
    </div>
  )
}

export default ProfileCard
