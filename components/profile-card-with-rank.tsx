import { ButtonBase, IconButton, useMediaQuery } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useGetRank } from '../api-routes/Profile'
import { ProfileContext } from '../contexts/profile.context'
import { appbarActions, profilePageActions } from '../data/actions'
import useInViewport from '../hooks/in-viewport.hook'
import usePopup from '../hooks/popup.hook'
import css from '../styles/profile-card.module.scss'
import { getMediaURL } from '../utils/get-url'
import MoreHorizontalIcon from './icons/more-horizontal.icon'
import RoyalTick from './icons/royal-tick'
import { ProfileCardLoader } from './profile-card'
import RankCard, { getCrown } from './rank-card'
import AvatarRing from './ui/avatar-ring'
import { BalanceCount } from './ui/balance-info'
import Button from './ui/button'
import { CommunityCount, MyCommunityCount, NoOfFollowers, NoOfPost } from './ui/profile-counts'
import Text from './ui/text-with-loader'

import type { storeType } from '../types'
import useBioPopupHandler from '../hooks/open-bio-popup.hook'

const ProfileCardWithRank = () => {
  const [isMobile, { profile: user, isLoading }, dispatch, router, rankRef, { openPopup }, options] = [
    useMediaQuery('(max-width: 744px)'),
    useContext(ProfileContext),
    useDispatch(),
    useRouter(),
    useInViewport({}),
    usePopup(),
    useSelector((store: storeType) => store.systemOptions)
  ]
  const openBioPopup = useBioPopupHandler(user.bio)
  const {
    data: rank,
    isLoading: isRankLoading,
    refetch: refetchRank
  } = useGetRank(user.username, rankRef.isVisible)

  useEffect(() => {
    refetchRank()
  }, [refetchRank, user.username])

  useEffect(() => {
    if (!user || isLoading) return
    dispatch(appbarActions.setTitle(user.username))
  }, [dispatch, isLoading, user])

  const handleClick = () => openPopup('profile-options')

  if (isLoading && !!user) return <ProfileCardLoader />

  const rankClickHandler = () => router.push('/leaderboard')
  const openFollowers = () => {
    dispatch(profilePageActions.openFollowers())
    // dispatch(profilePageActions.setPopup('followers'))
    // openPopup('followers-following')
  }
  const openCommunity = () => dispatch(profilePageActions.openCommunity())
  const openMyCommunity = () => dispatch(profilePageActions.openMyCommunity())
  const handleUpdateBios = () => {
    router.push('/bios')
  }

  return (
    <div className={css['profile-card-with-rank']}>
      {!options?.ambientBio || (
        <div
          className={css.bio_background}
          style={{ backgroundImage: `url('${getMediaURL(user?.bio?.src ?? '')}')` }}
        />
      )}
      <Head>
        <title>{!user?.name ? 'Profile' : user?.name} | DENAURLEN</title>
      </Head>
      {isMobile && (
        <ButtonBase onClick={rankClickHandler} className={css['rank-card-wrapper']}>
          <div className={css['rank-card']}>
            <div data-rank-wrapper ref={rankRef.ref}>
              {getCrown(rank || 0)}
              <span data-rank>
                <Text loading={isRankLoading} text={rank} />
              </span>
            </div>
            <BalanceCount />
          </div>
        </ButtonBase>
      )}
      <div className={css['profile-card']}>
        <div className={css['username-wrapper']}>
          <p className={css.username}>{user?.username}</p>
          <IconButton data-edit-button aria-label="profile-option" onClick={handleClick}>
            <MoreHorizontalIcon />
          </IconButton>
        </div>
        <div className={css['dp-row']}>
          <div className={css['dp-wrapper']}>
            <AvatarRing size={84} url={user?.profilePic} showStories username={user.username} />
            <div className={css['name-wrapper']}>
              <p data-name>
                {user?.name}&nbsp;{' '}
                {user?.isVerified && (
                  <span style={{ transform: 'translateY(12%)', scale: 0.8 }}>
                    <RoyalTick />
                  </span>
                )}
              </p>
              {(!user?.bio?.name && (
                <div>
                  <Button label="add bio" variant="text" removePadding onClick={handleUpdateBios} />
                </div>
              )) || (
                <p data-bio role="button" onClick={openBioPopup}>
                  {user?.bio.name || ''}
                </p>
              )}
            </div>
          </div>
          {isMobile || <BalanceCount />}
          <IconButton data-edit-button aria-label="profile-options" onClick={handleClick}>
            <MoreHorizontalIcon />
          </IconButton>
        </div>
        <div className={css['count-row']}>
          <div className={css.box}>
            <span>Posts</span>
            <p>
              <NoOfPost username={user.username || ''} />
            </p>
          </div>
          <ButtonBase className={css.box} onClick={openFollowers}>
            <span>Followers</span>
            <p>
              <NoOfFollowers username={user.username || ''} />
            </p>
          </ButtonBase>
          <ButtonBase className={css.box} onClick={openMyCommunity}>
            <span>My Community</span>
            <p>
              <MyCommunityCount username={user.username || ''} />
            </p>
          </ButtonBase>
          <ButtonBase className={css.box} onClick={openCommunity}>
            <span>Community</span>
            <p>
              <CommunityCount username={user.username || ''} />
            </p>
          </ButtonBase>
        </div>
      </div>
      {isMobile || <RankCard username={user.username} />}
    </div>
  )
}

export default ProfileCardWithRank
