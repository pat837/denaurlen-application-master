import { IconButton, useMediaQuery } from '@mui/material'
import { MouseEvent, useState } from 'react'

import usePopup from '../../../hooks/popup.hook'
import NotificationIcon from '../../icons/notification.icon'
import { BalanceButton } from '../balance-info'
import HideOnScroll from '../hide-on-scroll'
import Logo from '../logo'
import css from './home-screen-appbar.module.scss'

type postType_ = 'VALUATION' | 'GENERAL' | 'TOP10' | 'ALL'

const HomeScreenAppbar = ({ filter }: { filter: (type: postType_) => any }) => {
  const [isDesktop, { openPopup }] = [useMediaQuery('(min-width:1080px)'), usePopup()]

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const gotoActivity = () => {
    if (typeof Notification !== 'undefined' && Notification?.permission !== 'granted')
      Notification.requestPermission()
    openPopup('activity-screen')
  }

  const filterHandler = (type: postType_) => () => {
    filter(type)
    handleClose()
  }

  if (isDesktop) return <></>

  return (
    <>
      <HideOnScroll>
        <div className={css.wrapper}>
          <div className={css.header}>
            {/* <h2>
              Home{' '}
              <IconButton
                className={css.dropdown}
                id="filter-button"
                aria-controls={open ? 'filter-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <ChevronDownIcon />
              </IconButton>
            </h2> */}
            {/* <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'filter-button'
              }}
            >
              <MenuItem onClick={filterHandler('VALUATION')}>Valuation Posts</MenuItem>
              <MenuItem onClick={filterHandler('TOP10')}>Top10&apos;s Posts</MenuItem>
              <MenuItem onClick={filterHandler('GENERAL')}>General Posts</MenuItem>
              <Divider />
              <MenuItem onClick={filterHandler('ALL')}>All</MenuItem>
            </Menu> */}
            <Logo />
            <div>
              <IconButton aria-label="notifications" onClick={gotoActivity}>
                <NotificationIcon />
              </IconButton>{' '}
              <BalanceButton />
            </div>
          </div>
        </div>
      </HideOnScroll>
      <div className={css.fix} />
    </>
  )
}

export { HomeScreenAppbar }
