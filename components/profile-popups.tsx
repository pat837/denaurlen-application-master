import { ButtonBase, IconButton, useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SwipeableViews from 'react-swipeable-views'

import { useGetFollowersList, useGetFollowingList } from '../api-routes/Profile'
import useGetCommunity from '../api-routes/profile-queries/fetch-community'
import useGetMyCommunity from '../api-routes/profile-queries/fetch-my-community'
import { ProfileContext } from '../contexts/profile.context'
import { profilePageActions } from '../data/actions'
import useFetchNextPage from '../hooks/fetch-next-page.hook'
import CSS from '../styles/follow-list.module.scss'
import css from '../styles/profile-card.module.scss'
import { storeType } from '../types'
import XIcon from './icons/x.icon'
import Avatar from './ui/avatar'
import DialogBox from './ui/dialog-box'
import DotLoader from './ui/dot-loader'
import { FollowButton } from './ui/follow-buttons'
import LikeCommentDrawer from './ui/like-comment-drawer'

type ComponentList_ = { username: string }

const ProfilePopups = ({ username }: ComponentList_) => {
  const dispatch = useDispatch()
  const isSmallDevice = useMediaQuery('(max-width: 722px)')
  const [title, setTitle] = React.useState('')

  const { isCommunityPopupOpen, isFollowerPopupOpen, isFollowingPopupOpen, isMyCommunityPopupOpen } = useSelector(
    (store: storeType) => store.profilePage
  )
  const { closeFollowers, closeCommunity, closeFollowing, closeMyCommunity } = profilePageActions

  const isOpened = () =>
    isCommunityPopupOpen || isFollowerPopupOpen || isFollowingPopupOpen || isMyCommunityPopupOpen

  const onClose = () => {
    if (isMyCommunityPopupOpen) return dispatch(closeMyCommunity())
    if (isCommunityPopupOpen) return dispatch(closeCommunity())
    if (isFollowerPopupOpen) return dispatch(closeFollowers())
    if (isFollowingPopupOpen) return dispatch(closeFollowing())
  }

  const popupTitle = (
    <div className={css['popup-title-wrapper']}>
      <h5 className={css.title}>{title}</h5>
      <IconButton onClick={onClose} edge="end" aria-label="Close popup" className={css['popup-close-button']}>
        <XIcon />
      </IconButton>
    </div>
  )

  if (isSmallDevice)
    return (
      <LikeCommentDrawer open={isOpened()} title={title} onClose={onClose}>
        <div className={css.profile_popups}>
          {(isFollowerPopupOpen || isFollowingPopupOpen) && (
            <FollowersTabLayout currentTab={isFollowerPopupOpen ? 0 : 1} setTitle={setTitle} username={username} />
          )}
          {(isCommunityPopupOpen || isMyCommunityPopupOpen) && (
            <CommunityTabLayout currentTab={isCommunityPopupOpen ? 0 : 1} setTitle={setTitle} username={username} />
          )}
        </div>
      </LikeCommentDrawer>
    )

  return (
    <DialogBox isOpen={isOpened()} titleSection={popupTitle} onClose={onClose}>
      <div className={css.profile_popups}>
        {(isFollowerPopupOpen || isFollowingPopupOpen) && (
          <FollowersTabLayout currentTab={isFollowerPopupOpen ? 0 : 1} setTitle={setTitle} username={username} />
        )}
        {(isCommunityPopupOpen || isMyCommunityPopupOpen) && (
          <CommunityTabLayout currentTab={isCommunityPopupOpen ? 0 : 1} setTitle={setTitle} username={username} />
        )}
      </div>
    </DialogBox>
  )
}

export default ProfilePopups

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      className={`${css.tab_button}`}
    >
      {value === index && (
        <Box sx={{ pt: 3, width: '100%' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

export function FollowersTabLayout({
  currentTab,
  setTitle,
  username
}: {
  currentTab: number
  setTitle: (...a: any) => any
  username: string
}) {
  const theme = useTheme()
  const [value, setValue] = React.useState(currentTab)

  React.useEffect(() => {
    setTitle(currentTab === 0 ? 'Followers' : 'Following')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    setTitle(newValue === 0 ? 'Followers' : 'Following')
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        variant="fullWidth"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          backgroundColor: 'inherit'
        }}
      >
        <Tab label="Followers" {...a11yProps(0)} />
        <Tab label="Following" {...a11yProps(1)} />
      </Tabs>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <FollowersList username={username} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <FollowingList username={username} />
        </TabPanel>
      </SwipeableViews>
    </>
  )
}

export function CommunityTabLayout({
  currentTab,
  setTitle,
  username
}: {
  currentTab: number
  setTitle: (...a: any) => any
  username: string
}) {
  const theme = useTheme()
  const [value, setValue] = React.useState(currentTab)

  React.useEffect(() => {
    setTitle(currentTab === 0 ? 'Community' : 'My Community')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    setTitle(newValue === 0 ? 'Community' : 'My Community')
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="inherit"
        variant="fullWidth"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999
        }}
      >
        <Tab label="Community" {...a11yProps(0)} />
        <Tab label="My Community" {...a11yProps(1)} />
      </Tabs>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <CommunityList username={username} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <MyCommunityList username={username} />
        </TabPanel>
      </SwipeableViews>
    </>
  )
}

const FollowingList = ({ username }: ComponentList_) => {
  const [router, { profile }, dispatch] = [useRouter(), React.useContext(ProfileContext), useDispatch()]

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetFollowingList({
    username: username,
    size: 30
  })

  const lastCardRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  const clickHandler = (username: string) => () => {
    router.push(`/${username}`)
    dispatch(profilePageActions.closeFollowing())
  }

  return (
    <div className={CSS['wrapper']}>
      {isLoading ||
        !data?.pages?.length ||
        data.pages.map((user, index) => (
          <div
            key={user._id}
            ref={(index + 1 === data.pages.length && lastCardRef) || undefined}
            className={CSS['user-wrapper']}
          >
            <ButtonBase data-profile onClick={clickHandler(user.username)}>
              <Avatar url={user.profilePic} alt={user.name} className={CSS.avatar} />
              <div className={CSS['username-wrapper']}>
                <p>{user.username}</p>
                <span>{user.name}</span>
              </div>
            </ButtonBase>
            {profile._id === user._id || <FollowButton userId={user._id} username={username} />}
          </div>
        ))}
      {(isLoading || isFetchingNextPage) && (
        <div style={{ height: 50, display: 'grid', placeContent: 'center' }}>
          <DotLoader />
        </div>
      )}
    </div>
  )
}

const FollowersList = ({ username }: ComponentList_) => {
  const [router, { profile }, dispatch] = [useRouter(), React.useContext(ProfileContext), useDispatch()]

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetFollowersList({
    username: username,
    size: 30
  })

  const lastCardRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  const clickHandler = (username: string) => () => {
    router.push(`/${username}`)
    dispatch(profilePageActions.closeFollowers())
  }

  return (
    <div className={CSS['wrapper']}>
      {isLoading ||
        !data ||
        data.pages.map((user, index) => (
          <div
            key={user._id}
            ref={(index + 1 === data.pages.length && lastCardRef) || undefined}
            className={CSS['user-wrapper']}
          >
            <ButtonBase data-profile onClick={clickHandler(user.username)}>
              <Avatar url={user.profilePic} alt={user.name} className={CSS.avatar} />
              <div className={CSS['username-wrapper']}>
                <p>{user.username}</p>
                <span>{user.name}</span>
              </div>
            </ButtonBase>
            {profile._id === user._id || <FollowButton userId={user._id} username={username} />}
          </div>
        ))}
      {(isLoading || isFetchingNextPage) && (
        <div style={{ height: 50, display: 'grid', placeContent: 'center' }}>
          <DotLoader />
        </div>
      )}
    </div>
  )
}

const CommunityList = ({ username }: ComponentList_) => {
  const [{ profile }, router, dispatch] = [React.useContext(ProfileContext), useRouter(), useDispatch()]

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetCommunity({
    username,
    storeData: profile.username === username
  })

  const lastCardRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  const clickHandler = (username: string) => () => {
    router.push(`/${username}`)
    dispatch(profilePageActions.closeCommunity())
  }

  return (
    <div className={CSS['wrapper']}>
      {!data?.pages.length ||
        data.pages.map((page, in_) => {
          const isLastPage = in_ + 1 === data.pages.length
          return page.map((user, index) => (
            <div
              key={user._id}
              ref={(isLastPage && index === 20 && lastCardRef) || undefined}
              className={CSS['user-wrapper']}
            >
              <ButtonBase data-profile onClick={clickHandler(user.username)}>
                <Avatar url={user.profilePic} alt={user.name} className={css.avatar} />
                <div className={CSS['username-wrapper']}>
                  <p>{user.username}</p>
                  <span>{user.name}</span>
                </div>
              </ButtonBase>
              {profile._id === user._id || <FollowButton userId={user._id} username={username} />}
            </div>
          ))
        })}
      {(isLoading || isFetchingNextPage) && (
        <div style={{ height: 50, display: 'grid', placeContent: 'center' }}>
          <DotLoader />
        </div>
      )}
    </div>
  )
}

const MyCommunityList = ({ username }: ComponentList_) => {
  const [{ profile }, router, dispatch] = [React.useContext(ProfileContext), useRouter(), useDispatch()]

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetMyCommunity({
    username,
    storeData: profile.username === username
  })

  const lastCardRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  const clickHandler = (username: string) => () => {
    router.push(`/${username}`)
    dispatch(profilePageActions.closeMyCommunity())
  }

  return (
    <div className={CSS['wrapper']}>
      {!data?.pages.length ||
        data.pages.map((page, in_) => {
          const isLastPage = in_ + 1 === data.pages.length
          return page.map((user, index) => (
            <div
              key={user._id}
              ref={(isLastPage && index === 20 && lastCardRef) || undefined}
              className={CSS['user-wrapper']}
            >
              <ButtonBase data-profile onClick={clickHandler(user.username)}>
                <Avatar url={user.profilePic} alt={user.name} className={css.avatar} />
                <div className={CSS['username-wrapper']}>
                  <p>{user.username}</p>
                  <span>{user.name}</span>
                </div>
              </ButtonBase>
              {profile._id === user._id || <FollowButton userId={user._id} username={username} />}
            </div>
          ))
        })}
      {(isLoading || isFetchingNextPage) && (
        <div style={{ height: 50, display: 'grid', placeContent: 'center' }}>
          <DotLoader />
        </div>
      )}
    </div>
  )
}
