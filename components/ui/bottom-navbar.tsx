import { Badge, ButtonBase } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import { useRouter } from 'next/router'
import { JSXElementConstructor, ReactElement, useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useIsDailyLoginRewardCollected from '../../api-routes/rewards/is-collected'
import { messageActions, navbarActions } from '../../data/actions'
import { storeType } from '../../types'
import AddPostIcon from '../icons/add-post.icon'
import CompassFilledIcon from '../icons/compass-filled.icon'
import CompassIcon from '../icons/compass.icon'
import HomeFilledIcon from '../icons/home-filled.icon'
import HomeIcon from '../icons/home.icon'
import MenuIcon from '../icons/menu.icon'
import MessageFilledIcon from '../icons/message-filled.icon'
import css from './../../styles/bottom-navbar.module.scss'
import BottomAddOptionPopup from './bottom-add-option.popup'
import BottomMenu from './bottom-menu'
import ConditionalRender from './conditional-render'
import HideOnScroll, { AutoDisplay } from './hide-on-scroll'
import MessageIcon from './message-icon'

type Link = {
  icon: JSX.Element
  title: string
}

type NavLink = Link &
  (
    | {
        type: 'link'
        activeIcon: JSX.Element
      }
    | { type: 'button'; onClick: () => void }
  )

export const ScrollDisplayWrapper = ({
  auto,
  children
}: {
  auto: boolean
  children: ReactElement<any, string | JSXElementConstructor<any>>
}) => {
  if (auto) return <HideOnScroll direction="up">{children}</HideOnScroll>

  return <AutoDisplay>{children}</AutoDisplay>
}

const BottomNavbar = () => {
  const [dispatch, router, { autoHide }] = [
    useDispatch(),
    useRouter(),
    useSelector((state: storeType) => state.navbar)
  ]

  const { data, isLoading } = useIsDailyLoginRewardCollected()

  const [navList] = useState<NavLink[]>([
    {
      type: 'link',
      icon: <HomeIcon />,
      activeIcon: <HomeFilledIcon />,
      title: 'home'
    },
    {
      type: 'link',
      activeIcon: <CompassFilledIcon />,
      icon: <CompassIcon />,
      title: 'explore'
    },
    {
      type: 'button',
      icon: <AddPostIcon />,
      onClick: () => dispatch(navbarActions.openAddOption()),
      title: 'add-post'
    }
  ])

  const observer = useRef<any>()
  const fixRef = useCallback(
    (node: any) => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        dispatch(navbarActions.setAutoHide(!entries[0].isIntersecting))
      })
      if (node) observer.current.observe(node)
    },
    [dispatch]
  )

  return (
    <>
      <ScrollDisplayWrapper auto={autoHide}>
        <AppBar elevation={0} position="fixed" color="transparent" className={css.wrapper}>
          <nav title="bottom-navigation">
            {navList.map(nav => (
              <ButtonBase
                key={nav.title}
                aria-label={nav.title}
                onClick={nav.type === 'link' ? () => router.push(`/${nav.title}`) : nav.onClick}
              >
                {nav.type === 'link' ? (
                  <ConditionalRender condition={router.asPath.includes(nav.title)}>
                    {nav.activeIcon}
                    {nav.icon}
                  </ConditionalRender>
                ) : (
                  nav.icon
                )}
              </ButtonBase>
            ))}
            <ButtonBase
              aria-label="messaging"
              onClick={() => {
                if (typeof Notification !== 'undefined' && Notification?.permission !== 'granted')
                  Notification.requestPermission()
                dispatch(messageActions.clearConversation())
                router.push('/messaging')
              }}
            >
              <ConditionalRender condition={router.asPath.includes('messaging')}>
                <MessageFilledIcon />
                <MessageIcon />
              </ConditionalRender>
            </ButtonBase>
            <ButtonBase aria-label="menu" onClick={() => dispatch(navbarActions.openMenu())}>
              <Badge color="error" badgeContent={isLoading || data === undefined ? 0 : data ? 0 : 1} variant="dot">
                <MenuIcon />
              </Badge>
            </ButtonBase>
          </nav>
        </AppBar>
      </ScrollDisplayWrapper>
      <div className={css.fix} ref={fixRef} />
      <BottomMenu />
      <BottomAddOptionPopup />
    </>
  )
}

export default BottomNavbar
