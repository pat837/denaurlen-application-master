import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { Fragment, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ProfileContext } from '../../contexts/profile.context'
import { appbarActions, messageActions } from '../../data/actions'
import usePopup from '../../hooks/popup.hook'
import { storeType } from '../../types'
import BookMarkIcon from '../icons/bookmark.icon'
import BackIcon from '../icons/chevron-left.icon'
import SearchIcon from '../icons/search.icon'
import SwapIcon from '../icons/swap2.icon'
import TaggedPostsIcon from '../icons/tagged-posts.icon'
import UserIcon from '../icons/user.icon'
import css from './../../styles/appbar.module.scss'
import Avatar from './avatar'
import { BalanceButton } from './balance-info'
import DailyLoginRewardIcon from './daily-login-reward-icon'
import HideOnScroll from './hide-on-scroll'
import Logo from './logo'
import ChatIcon from './message-icon'
import NotificationIcon from './notification-icon'

const Appbar = () => {
  const [{ profile: user }, state, router, dispatch, isDesktop, { openPopup }] = [
    useContext(ProfileContext),
    useSelector((state: storeType) => state.appbar),
    useRouter(),
    useDispatch(),
    useMediaQuery('(min-width:1080px)'),
    usePopup()
  ]

  const searchHandler = () => dispatch(appbarActions.openSearch())

  const Wrapper = isDesktop ? Fragment : HideOnScroll

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const gotoMessaging = () => {
    if (typeof Notification !== 'undefined' && Notification?.permission !== 'granted')
      Notification.requestPermission()
    dispatch(messageActions.clearConversation())
    router.push('/messaging')
  }

  const gotoActivity = () => {
    if (typeof Notification !== 'undefined' && Notification?.permission !== 'granted')
      Notification.requestPermission()
    openPopup('activity-screen')
  }

  if (!isDesktop && router.asPath.includes('home')) return <></>

  return (
    <>
      <Wrapper>
        <header className={css.wrapper}>
          <div className={css.logo_container}>
            <Logo />
            {router.pathname.includes('messaging') || (
              <button data-search onClick={searchHandler}>
                <span>Search...</span>
                <SearchIcon />
              </button>
            )}
          </div>
          <div className={css.back_button_container}>
            <IconButton
              aria-label="back"
              edge="start"
              style={{ display: state.showBackButton ? 'grid' : 'none' }}
              onClick={router.back}
            >
              <BackIcon />
            </IconButton>
            <p data-page-title>{state.title}</p>
          </div>
          <div className={css.button_container}>
            <IconButton data-chat-button aria-label="messaging" onClick={gotoMessaging}>
              <ChatIcon />
            </IconButton>
            {isDesktop && <DailyLoginRewardIcon />}
            <IconButton aria-label="notifications" onClick={gotoActivity}>
              <NotificationIcon />
            </IconButton>
            <IconButton
              data-profile-pic
              id="profile-button"
              aria-controls={open ? 'profile-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <Avatar className={css.avatar} alt="profile pic" url={user.profilePic} />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'profile-button'
              }}
            >
              <MenuItem
                onClick={() => {
                  router.push('/profile')
                  handleClose()
                }}
              >
                <ListItemIcon>
                  <UserIcon />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => router.push('/profile/posts/saved')}>
                <ListItemIcon>
                  <BookMarkIcon />
                </ListItemIcon>
                <ListItemText>Saved Post</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => router.push('/profile/posts/tagged')}>
                <ListItemIcon>
                  <TaggedPostsIcon />
                </ListItemIcon>
                <ListItemText>Tagged Post</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <SwapIcon />
                </ListItemIcon>
                <ListItemText>Switch Account</ListItemText>
              </MenuItem>
            </Menu>
            <BalanceButton />
          </div>
        </header>
      </Wrapper>
      <div className={css.appbar_fix} />
    </>
  )
}

export default Appbar
