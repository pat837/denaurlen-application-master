import { Badge, ButtonBase, Divider, Drawer } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ProfileContext } from '../../contexts/profile.context'
import { navbarActions } from '../../data/actions'
import css from '../../styles/bottom-navbar.module.scss'
import BenchmarksIcon from '../icons/benchmark.icon'
import BookMarkIcon from '../icons/bookmark.icon'
import LeaderboardIcon from '../icons/leaderboard.icon'
import SettingsIcon from '../icons/settings.icon'
import StatsboardsIcon from '../icons/statsboards.icon'
import TaggedPostsIcon from '../icons/tagged-posts.icon'
import Avatar from './avatar'
import DailyLoginRewardIcon from './daily-login-reward-icon'

import type { storeType } from '../../types'
import useGetReferralCount from '../../api-routes/settings/get-referral-count'
import useToastMessage from '../../hooks/toast-message.hook'
type LinkButtonProps = {
  label: string
  icon: ReactNode
  onClick: () => any
}

const LinkButton = ({ label, icon, onClick }: LinkButtonProps) => (
  <ButtonBase className={css.link} aria-label={label} onClick={onClick}>
    {icon}
    <p>{label}</p>
  </ButtonBase>
)

const BottomMenu = () => {
  const [dispatch, navbar, router, { profile }, showToast] = [
    useDispatch(),
    useSelector((state: storeType) => state.navbar),
    useRouter(),
    useContext(ProfileContext),
    useToastMessage()
  ]

  const { data: count } = useGetReferralCount()

  const settingIcon =
    (count ?? 10) === 10 ? (
      <SettingsIcon />
    ) : (
      <Badge color="error" badgeContent={count} variant="dot">
        <SettingsIcon />
      </Badge>
    )

  const onClose = () => dispatch(navbarActions.closeMenu())

  const [rowOne, rowTwo] = [
    useState([
      {
        label: 'saved posts',
        icon: <BookMarkIcon />,
        onClick: () => {
          router.push('/profile/posts/saved')
          onClose()
        }
      },
      {
        label: 'tagged posts',
        icon: <TaggedPostsIcon />,
        onClick: () => {
          router.push('/profile/posts/tagged')
          onClose()
        }
      },
      {
        label: 'settings',
        icon: settingIcon,
        onClick: () => {
          router.push('/settings')
          onClose()
        }
      }
    ])[0],
    useState([
      {
        label: 'Leaderboard',
        icon: <LeaderboardIcon />,
        onClick: () => {
          router.push('/leaderboard')
          onClose()
        }
      },
      {
        label: 'Benchmarks',
        icon: <BenchmarksIcon />,
        onClick: () => {
          if ('vibrate' in navigator) navigator?.vibrate(100)
          showToast('This feature will enabled in future updates')
          // router.push('/benchmarks')
          onClose()
        }
      },
      {
        label: 'Statsboard',
        icon: <StatsboardsIcon />,
        onClick: () => {
          router.push('/statsboard')
          onClose()
        }
      }
    ])[0]
  ]

  return (
    <Drawer
      variant="temporary"
      anchor="bottom"
      open={navbar.showMenu}
      onClose={onClose}
      classes={{ paper: css['bottom-menu-wrapper'], root: css.root }}
    >
      <div className={css['bottom-menu']}>
        <div className={css.profile}>
          <ButtonBase
            aria-label="profile"
            data-profile-wrapper
            onClick={() => {
              onClose()
              router.push('/profile')
            }}
          >
            <Avatar className={css.avatar} url={profile.profilePic} alt={profile.name} />
            <p style={{ textAlign: 'left' }}>
              {profile.username}
              <br />
              <span>{profile.name}</span>
            </p>
          </ButtonBase>
          <DailyLoginRewardIcon onClick={onClose} />
        </div>
        <Divider />
        <div className={css['link-wrapper']}>
          <div>
            {rowOne.map(({ icon, label, onClick }, _) => (
              <LinkButton key={`row-one-link-${_}`} onClick={onClick} icon={icon} label={label} />
            ))}
          </div>
          <div>
            {rowTwo.map(({ icon, label, onClick }, _) => (
              <LinkButton key={`row-two-link-${_}`} onClick={onClick} icon={icon} label={label} />
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default BottomMenu
