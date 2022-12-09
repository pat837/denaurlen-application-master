import { ButtonBase, IconButton, useMediaQuery } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useGetRank } from '../api-routes/Profile'
import useGetProfile from '../api-routes/profile-queries/fetch-profile'
import { appbarActions, profilePageActions } from '../data/actions'
import useInViewport from '../hooks/in-viewport.hook'
import usePopup from '../hooks/popup.hook'
import css from '../styles/profile-card.module.scss'
import { numberFormat } from '../utils'
import { getMediaURL } from '../utils/get-url'
import MoreHorizontalIcon from './icons/more-horizontal.icon'
import RoyalTick from './icons/royal-tick'
import { ProfileCardLoader } from './profile-card'
import RankCard, { getCrown } from './rank-card'
import AvatarRing from './ui/avatar-ring'
import { OthersBalanceCount as BalanceCount } from './ui/balance-info'
import { FollowButton } from './ui/follow-buttons'
import MessageButton from './ui/message-button'
import { CommunityCount, MyCommunityCount, NoOfFollowers, NoOfPost } from './ui/profile-counts'

import type { storeType } from '../types'
import useBioPopupHandler from '../hooks/open-bio-popup.hook'

const OthersProfileWithRank = ({ username }: { username: string }) => {
  const [isMobile, dispatch, router, rankRef, { openPopup }, options] = [
    useMediaQuery('(max-width: 744px)'),
    useDispatch(),
    useRouter(),
    useInViewport({}),
    usePopup(),
    useSelector((store: storeType) => store.systemOptions)
  ]

  const { data: user, isLoading } = useGetProfile(username, false)

  const { data: rank, isLoading: isRankLoading, refetch: refetchRank } = useGetRank(username, rankRef.isVisible)

  const openBioPopup = useBioPopupHandler(user?.bio ?? { meaning: '', name: '', src: '' })

  useEffect(() => {
    refetchRank()
  }, [refetchRank, username])

  useEffect(() => {
    if (!user || isLoading) return
    dispatch(appbarActions.setTitle(user.username))
  }, [user, isLoading, dispatch])

  if (isLoading && !!user) return <ProfileCardLoader />

  const rankClickHandler = () => router.push('/leaderboard')
  const openFollowers = () => dispatch(profilePageActions.openFollowers())
  const openCommunity = () => dispatch(profilePageActions.openCommunity())
  const openMyCommunity = () => dispatch(profilePageActions.openMyCommunity())
  const handleOptions = () => openPopup('profile-options', { params: { userId: user?._id } })

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
              <span data-rank>{isRankLoading ? '0' : numberFormat(rank || 0)}</span>
            </div>
            <BalanceCount username={username} />
          </div>
        </ButtonBase>
      )}
      <div className={css['profile-card']}>
        <div className={css['username-wrapper']}>
          <p className={css.username}>{user?.username}</p>
          <div />
        </div>
        <div className={css['dp-row']}>
          <div className={css['dp-wrapper']}>
            <AvatarRing size={84} url={user?.profilePic} showStories username={user?.username || ''} />
            <div className={css['name-wrapper']}>
              <p data-name>
                {user?.name}&nbsp;{' '}
                {user?.isVerified && (
                  <span style={{ transform: 'translateY(12%)', scale: 0.8 }}>
                    <RoyalTick />
                  </span>
                )}
              </p>
              <p data-bio role="button" onClick={openBioPopup}>
                {user?.bio.name || ''}
              </p>
            </div>
          </div>
          {isMobile || <BalanceCount username={username} />}
        </div>
        <div className={css['count-row']}>
          <div className={css.box}>
            <span>Posts</span>
            <p>
              <NoOfPost username={user?.username || ''} />
            </p>
          </div>
          <ButtonBase className={css.box} onClick={openFollowers}>
            <span>Followers</span>
            <p>
              <NoOfFollowers username={user?.username || ''} />
            </p>
          </ButtonBase>
          <ButtonBase className={css.box} onClick={openMyCommunity}>
            <span>My Community</span>
            <p>
              <MyCommunityCount username={user?.username || ''} />
            </p>
          </ButtonBase>
          <ButtonBase className={css.box} onClick={openCommunity}>
            <span>Community</span>
            <p>
              <CommunityCount username={user?.username || ''} />
            </p>
          </ButtonBase>
        </div>
        <div className={css['follow-btn-wrapper']}>
          <FollowButton userId={user?._id || ''} username={user?.username || ''} />
          <MessageButton profileId={user?._id || ''} />
          <IconButton aria-label="more-option" onClick={handleOptions}>
            <MoreHorizontalIcon />
          </IconButton>
        </div>
      </div>
      {isMobile || <RankCard username={username} />}
    </div>
  )
}

export default OthersProfileWithRank
