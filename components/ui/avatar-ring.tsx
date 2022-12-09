import { Avatar, ButtonBase } from '@mui/material'
import { useRouter } from 'next/router'
import { CSSProperties, MouseEvent, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import useFetchStoriesByUsername from '../../api-routes/posts/story/fetch-stories'
import useIsStoriesViewed from '../../api-routes/posts/story/is-viewed'
import { getMediaURL } from '../../utils/get-url'
import { ProfileContext } from '../../contexts/profile.context'
import { storyActions } from '../../data/actions'
import css from '../../styles/ui.module.scss'

type AvatarRingProps = {
  url?: string
  title?: string
  size?: number
  showStories?: boolean
  username: string
  disableClick?: boolean
}

const AvatarRing = ({
  url,
  title,
  size = 60,
  showStories = false,
  username,
  disableClick = false
}: AvatarRingProps) => {
  const [router, { profile }, dispatch, style] = [
    useRouter(),
    useContext(ProfileContext),
    useDispatch(),
    { '--profile-size': `${size + 10}px` } as CSSProperties
  ]

  const [{ statusClass, avatarClass, clickHandler }, setSate] = useState({
    statusClass: css.status_ring,
    avatarClass: `${css['avatar-ring']} ${css['no-status']}`,
    clickHandler: (event: any) => {
      event.stopPropagation()
    }
  })

  const { data } = useFetchStoriesByUsername(showStories ? username : '')

  const {
    data: views,
    invalidateQuery,
    isLoading
  } = useIsStoriesViewed(
    (data || []).map(story => story._id),
    username
  )

  useEffect(() => {
    if (data === undefined) {
    } else {
      invalidateQuery()
      const hasStatus = data.length > 0
      const isPremium = data.some(story => story.storyType === 'PREMIUM')

      const sc = `${css.status_ring} ${hasStatus && css.had_status} ${isPremium && css['is-premium']}`
      const ac = `${css['avatar-ring']} ${hasStatus || css['no-status']}`

      setSate({
        statusClass: sc,
        avatarClass: ac,
        clickHandler: hasStatus
          ? (event: MouseEvent<HTMLButtonElement>) => {
              dispatch(
                storyActions.openStoryPopup({
                  username: username,
                  profilePic: url || ''
                })
              )
              event.stopPropagation()
            }
          : () => {
              router.push(profile.username === username ? '/profile' : `/${username}`)
            }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <ButtonBase className={avatarClass} onClick={disableClick ? undefined : clickHandler} style={style}>
      <div className={`${statusClass} ${views?.every(v => v) && css.viewed} ${isLoading && css.loading}`}>
        <Avatar
          className={css.dp}
          src={!url ? undefined : getMediaURL(url)}
          alt={!url ? undefined : title}
          imgProps={{ loading: 'lazy' }}
        />
      </div>
    </ButtonBase>
  )
}

export default AvatarRing
