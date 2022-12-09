import { Drawer, IconButton, Menu, MenuItem, Skeleton } from '@mui/material'
import moment from 'moment'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import storyQueries from '../../api-routes/posts/story'
import { useFetchGeneralStoryViews } from '../../api-routes/posts/story/fetch-views'
import useStoryViewCounts from '../../api-routes/posts/story/view-counts'
import { storyActions } from '../../data/actions'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import styles from '../../styles/components/ui/story-view.module.scss'
import css from '../../styles/story-popup.module.scss'
import { storeType } from '../../types'
import EyeOffIcon from '../icons/eye-off.icon'
import MoreVerticalIcon from '../icons/more-vertical.icon'
import XIcon from '../icons/x.icon'
import AvatarRing from './avatar-ring'
import DotLoader from './dot-loader'
import Image from './picture'

const isToday = (date: Date) => moment(date).isSame(moment().clone().startOf('day'), 'd')

const StoryViewPopup = () => {
  const [isDeleting, setLoader] = useState(false)

  const [{ openStoryViewsPopup, currentStory, toggleMore }, dispatch, showToast] = [
    useSelector(({ storyState }: storeType) => storyState),
    useDispatch(),
    useToastMessage()
  ]

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useFetchGeneralStoryViews({
    storyId: currentStory._id,
    size: 20
  })

  const {
    data: viewCount,
    isLoading: isViewCountLoading,
    invalidateQuery: refetchCounts
  } = useStoryViewCounts(currentStory._id)

  const closeHandler = () => {
    refetchCounts()
    if (!!toggleMore) toggleMore(false)
    dispatch(storyActions.closeStoryViewPopup())
  }

  const triggerNetPage = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    setLoader(true)

    storyQueries.general.delete({
      storyId: currentStory._id,
      onSuccess: () => {
        setLoader(false)
        dispatch(storyActions.closeStoryPopup())
        showToast('Story is deleted')
      },
      onError: () => {
        setLoader(false)
        showToast('Unable to delete story, please try again later')
        handleClose()
      }
    })
  }

  return (
    <Drawer
      open={openStoryViewsPopup && currentStory.storyType === 'GENERAL'}
      onClose={closeHandler}
      anchor="bottom"
      style={{ zIndex: 99999999999 }}
    >
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.heading}>
            <h5>My Story Updates</h5>
            <div className={styles.story}>
              <div className={styles.img}>
                <Image src={currentStory.src} alt={currentStory.caption || 'story'} aspectRatio="1 / 1" />
              </div>
              <div className={styles.details}>
                <div>
                  <span>Posted at</span>
                  <p>
                    {isToday(currentStory.createdAt) ? 'Today, ' : 'Yesterday, '}
                    {moment(currentStory.createdAt).format('LT')}
                  </p>
                </div>
                <IconButton
                  aria-label="more-options"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <MoreVerticalIcon />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button'
                  }}
                  style={{ zIndex: 999999999999 }}
                >
                  <MenuItem onClick={handleDelete}>{isDeleting ? 'Deleting...' : 'Delete'}</MenuItem>
                </Menu>
              </div>
            </div>
          </div>
          <div className={!currentStory ? styles['no-views'] : styles.views}>
            {!currentStory ? (
              <div className={styles.info}>
                <EyeOffIcon />
                <p>No views yet</p>
              </div>
            ) : isLoading || !data?.pages ? (
              <div className={styles.views_list}>
                {Array.from(Array(5).keys()).map(_in => (
                  <Skeleton key={_in} variant="rectangular" animation="wave" height="56px" width="100%" />
                ))}
              </div>
            ) : (
              <div className={styles.views_list}>
                {data.pages.map((page, pageNo) => {
                  const isLastPage = pageNo + 1 === data.pages.length

                  return page.map(({ _id, createdAt, viewedBy }, index) => (
                    <div
                      key={_id}
                      ref={isLastPage && index === 15 ? triggerNetPage : undefined}
                      className={css.list_item}
                    >
                      <div className={css.profile_wrapper}>
                        <AvatarRing size={46} url={viewedBy.profilePic} username={viewedBy.username} />
                        <div className={css.name_wrapper}>
                          <p>{viewedBy.username}</p>
                          <span>{viewedBy.name}</span>
                        </div>
                      </div>
                      <code>
                        {isToday(createdAt) ? 'Today' : 'Yesterday'}
                        <br />
                        {moment(createdAt).format('[at] LT')}
                      </code>
                    </div>
                  ))
                })}
                <div style={{ height: 360 }} />
                <div style={{ height: 136 }} />
                <div style={{ height: 136 }} />
                <div style={{ height: 136 }} />
                <div style={{ height: 136 }} />
                <div style={{ height: 136 }} />
                {isFetchingNextPage && (
                  <div style={{ display: 'grid', placeItems: 'center', height: 40 }}>
                    <DotLoader />
                  </div>
                )}
              </div>
            )}
            <div className={styles.title}>
              <h3>{isViewCountLoading ? 'Loading...' : ` ${viewCount} Views`}</h3>
              <IconButton
                className={styles['close-button']}
                aria-label="close-story-details"
                onClick={closeHandler}
              >
                <XIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default StoryViewPopup
