import css from './notifications.module.scss'

import router from 'next/router'
import { MouseEvent } from 'react'
import { ButtonBase } from '@mui/material'
import Avatar from '../avatar'
import Picture from '../picture'
import type { NotificationType_, Notification_ } from '../../../types/notifications.types'
import useMarkAsRead from '../../../api-routes/notifications/mark-as-read'
import { dateFormat } from '../../../utils'

type NotificationCardProps_ = {
  notification: Notification_
}

const getDesc = (type: NotificationType_) => {
  switch (type) {
    case 'FOLLOW':
      return 'started following you'
    case 'TAG':
      return 'tagged you'
    case 'POST_COMMENT':
      return 'commented on your post'
    case 'POST_INTEREST':
      return 'interested your post'
    case 'POST_LIKE':
      return 'liked your post'
    case 'UPLOADS':
      return 'uploaded valuation post'
    case 'INFINITE':
      return 'start revaluation for this post'
    case 'REVERT':
      return 'kept this post for revaluation'
    case 'MENTION':
      return 'mention you'
    default:
      return ''
  }
}

const NotificationCard = ({ notification }: NotificationCardProps_) => {
  let style = [css['list-item']]
  if (notification.isNew) style.push(css.new_list)

  const { mutate: markAsRead } = useMarkAsRead()

  const profileClickHandler = (event: MouseEvent<HTMLSpanElement | HTMLDivElement>) => {
    event.stopPropagation()

    if (notification.isNew) markAsRead(notification._id)
    router.push(`/${notification.from_user?.username}`)
  }

  const postClickHandler = () => {
    if (notification.isNew) markAsRead(notification._id)

    if (notification.post === undefined) return router.push(`/${notification.from_user?.username}`)

    const type = notification.post.postType

    if (type.toLowerCase() === 'top10') return router.push(`/post/category/${notification.post._id}`)
    router.push(`/post/${type.toLowerCase()}/${notification.post._id}`)
  }

  return (
    <ButtonBase className={style.join(' ')} onClick={postClickHandler}>
      <div role="button" onClick={profileClickHandler}>
        <Avatar url={notification.from_user?.profilePic} alt={notification.from_user?.username} />
      </div>
      <p>
        <span role="button" onClick={profileClickHandler}>
          {notification.from_user?.username}
        </span>
        {getDesc(notification.notificationType)}
        <time>&nbsp;●&nbsp;{dateFormat(notification.createdAt, true)}</time>
      </p>
      {notification?.post === undefined || (
        <div className={css.post}>
          <Picture src={notification.post.thumbnail ?? notification.post.src[0]} alt="post-preview" />
        </div>
      )}
    </ButtonBase>
  )
}

export { NotificationCard }
