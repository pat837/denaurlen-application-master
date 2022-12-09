import { ButtonBase, Drawer, IconButton } from '@mui/material'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import Stories from 'react-insta-stories'
import { Story } from 'react-insta-stories/dist/interfaces'
import { useDispatch, useSelector } from 'react-redux'

import useFetchStoriesByUsername from '../../api-routes/posts/story/fetch-stories'
import useViewStory from '../../api-routes/posts/story/view-story'
import constants from '../../config/constants'
import { isToday } from '../../utils'
import { getMediaURL } from '../../utils/get-url'
import { ProfileContext } from '../../contexts/profile.context'
import { storyActions } from '../../data/actions'
import css from '../../styles/components/ui/stories-popup.module.scss'
import EyeIcon from '../icons/eye.icon'
import MoreVerticalIcon from '../icons/more-vertical.icon'
import XIcon from '../icons/x.icon'

import type { storeType } from '../../types'
import type { Story_ } from '../../types/story.type'

const StoriesPopup = () => {
  const [
    { user, openStoryPopup, currentStoryIndex, openStoryViewsPopup, openPremiumStory },
    dispatch,
    { profile }
  ] = [useSelector((store: storeType) => store.storyState), useDispatch(), useContext(ProfileContext)]

  const { data, invalidateQuery } = useFetchStoriesByUsername(user.username)

  const { mutate: viewStory } = useViewStory({
    username: user.username,
    callback: {
      success: () => {},
      error: () => {}
    }
  })

  const [stories, setStories] = useState<Story[]>([])

  const closeHandler = () => {
    invalidateQuery()
    dispatch(storyActions.closeStoryPopup())
  }

  useEffect(() => {
    if (data === undefined) return setStories([])

    const openViewList = (story: Story_, index: number, toggleMore: any) =>
      dispatch(storyActions.openStoryViewPopup(story, index, toggleMore))

    setStories(
      data.map((story, index) => {
        const url = getMediaURL(story.src)

        return {
          url,
          duration: constants.GENERAL_STORY_VIEW_DURATION,
          type: 'image',
          seeMore: () => <></>,
          header: {
            heading: user.username,
            subheading: `${isToday(story.createdAt) ? 'Today, ' : 'Yesterday, '}
          ${moment(story.createdAt).format('LT')}`,
            profileImage: !user.profilePic ? '/assets/avatar.jpg' : getMediaURL(user.profilePic)
          },
          seeMoreCollapsed: ({ toggleMore, action }) => {
            const isOwnStory = story.uploader === profile._id
            const viewViewList = () => {
              toggleMore(true)
              openViewList(data[index], index, toggleMore)
            }

            return (
              <div className={`${css.caption_wrapper} ${!story.caption ? '' : css.show}`}>
                {!story.caption || (
                  <div className={css.caption}>
                    <p>{story.caption}</p>
                  </div>
                )}
                <div className={css.options}>
                  {isOwnStory && (
                    <ButtonBase className={css.views} onClick={viewViewList}>
                      <EyeIcon />
                    </ButtonBase>
                  )}
                  <IconButton
                    onClick={isOwnStory ? viewViewList : undefined}
                    className={css.option}
                    aria-label="more-options"
                  >
                    <MoreVerticalIcon className={css.svg} />
                  </IconButton>
                </div>
              </div>
            )
          }
        }
      })
    )
  }, [data, dispatch, profile._id, user.profilePic, user.username])

  return (
    <Drawer
      variant="temporary"
      anchor="bottom"
      open={openStoryPopup || openStoryViewsPopup}
      onClose={closeHandler}
      style={{ zIndex: 99999999999 }}
    >
      <div className={css.wrapper}>
        {!data?.length || stories.length === 0 || openStoryViewsPopup || openPremiumStory || (
          <Stories
            height="100vh"
            width="min(630px, 100%)"
            keyboardNavigation
            defaultInterval={500}
            stories={stories}
            currentIndex={currentStoryIndex}
            onAllStoriesEnd={closeHandler}
            onStoryStart={(s: number, st: any) => {
              const story = data[s]
              viewStory({ storyId: story._id, storyType: story.storyType })
            }}
            onStoryEnd={(s: any) => {
              const story = data[s]
              viewStory({ storyId: story._id, storyType: story.storyType })
            }}
          />
        )}
        <IconButton className={css.close_button} onClick={closeHandler}>
          <XIcon />
        </IconButton>
      </div>
    </Drawer>
  )
}

export default StoriesPopup
