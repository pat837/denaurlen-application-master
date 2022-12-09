import { ButtonBase, IconButton } from '@mui/material'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { CSSProperties, ReactNode, useCallback, useContext } from 'react'

import useGetCategoryPostCounts from '../../api-routes/posts/category/fetch-post-counts'
import { ProfileContext } from '../../contexts/profile.context'
import css from '../../styles/post-card.module.scss'
import { numberFormat, sleep } from '../../utils'
import { getMediaURL } from '../../utils/get-url'
import BookMarkFilledIcon from '../icons/bookmark-filled.icon'
import BookMarkIcon from '../icons/bookmark.icon'
import CommentsIcon from '../icons/comments.icon'
import EmptyStateCameraIcon from '../icons/empty-state-camera.icon'
import ExternalLink from '../icons/external-link.icon'
import InterestedIcon from '../icons/interested.icon'
import InterestingIcon from '../icons/interesting.icon'
import LikeIcon from '../icons/like.icon'
import LikedIcon from '../icons/liked.icon'
import MoreVerticalIcon from '../icons/more-vertical.icon'
import SendIcon from '../icons/send.icon'
import UserIcon from '../icons/user.icon'
import AvatarRing from './avatar-ring'
import ReadMore from './read-more'

type PostCardProps = {
  children: ReactNode
}

type PostCardHeaderProps = {
  profilePic?: string
  username: string
  place?: string
  date?: Date
  userId: string
  menuHandler: () => void
  categoryIcon?: ReactNode
}

type PostCardFooterProps = {
  likeHandler: () => void
  saveHandler: () => void
  viewLikes: () => void
  viewComments: () => void
  caption: string
  isLiked: boolean
  likesCount: number
  commentsCount: number
  isSaved: boolean
}

const getText = (number: number | undefined, isShort = false) =>
  number !== undefined ? `${numberFormat(number, isShort)}` : ''

export const PostCardHeader = ({
  profilePic,
  username,
  place,
  date,
  userId,
  categoryIcon,
  menuHandler
}: PostCardHeaderProps) => {
  const [router, { profile }] = [useRouter(), useContext(ProfileContext)]

  const clickHandler = () => {
    router.push(profile.username === username ? '/profile' : `/${username}`)
  }

  return (
    <div className={css.top}>
      <div onClick={clickHandler} style={{ paddingLeft: '0.4rem' }} role="button" data-user-wrapper>
        {profilePic ? (
          <AvatarRing size={40} url={profilePic} showStories username={username} />
        ) : (
          <AvatarRing size={40} username={username} />
        )}
        <div data-username>
          <p>{username}</p>
          <span>
            {!!place
              ? place.length > 26
                ? `${place.slice(0, 22)}...`
                : place
              : date === undefined || moment(date).fromNow()}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {categoryIcon}
        <IconButton aria-label="more-options" onClick={menuHandler}>
          <MoreVerticalIcon />
        </IconButton>
      </div>
    </div>
  )
}

export const PostCardFooter = ({
  likeHandler,
  likesCount,
  isLiked,
  commentsCount,
  isSaved,
  saveHandler,
  viewComments,
  viewLikes,
  caption
}: PostCardFooterProps) => {
  return (
    <div>
      {!caption || (
        <div className={css.caption}>
          <ReadMore text={caption} tag="p" />
        </div>
      )}
      <div className={css.bottom}>
        <div className={css['like-section']}>
          <div data-btn>
            <IconButton className={isLiked ? css.liked : ''} onClick={likeHandler}>
              {isLiked ? <LikedIcon /> : <LikeIcon />}
            </IconButton>
            <IconButton aria-label="comments" onClick={viewComments}>
              <CommentsIcon />
            </IconButton>
            <IconButton>
              <SendIcon />
            </IconButton>
          </div>
          <a role="button" onClick={viewLikes}>
            {numberFormat(likesCount)} Likes
          </a>
          <span role="button" onClick={viewComments}>
            {commentsCount === 0 ? 'No comments yet' : commentsCount + ' comments'}
          </span>
        </div>
        <IconButton aria-label="save" onClick={saveHandler}>
          {isSaved ? <BookMarkFilledIcon /> : <BookMarkIcon />}
        </IconButton>
      </div>
    </div>
  )
}

export const PostImage = ({
  src,
  onClick,
  slot,
  ratio = '1 / 1',
  title,
  showInterestingIcon = false,
  tags = 0,
  onTagView = () => {}
}: {
  src: string
  onClick?: () => void
  slot?: number
  ratio?: string
  title?: string
  showInterestingIcon?: boolean
  tags?: number
  onTagView?: () => void
}) => (
  <ButtonBase
    className={css.image_wrapper}
    role="button"
    style={{ '--ratio': ratio } as CSSProperties}
    disableRipple
    onDoubleClick={event => {
      const element = event.currentTarget
      element.classList.add(css.active_like)
      !onClick || onClick()
      sleep(1200, () => {
        element.classList.remove(css.active_like)
      })
    }}
  >
    <Image className={css.image} src={getMediaURL(src)} alt="post" layout="fill" />
    {showInterestingIcon ? (
      <InterestedIcon className={css.interesting_icon} />
    ) : (
      <LikedIcon className={css.like_icon} />
    )}
    {!slot || (
      <div className={css.slot}>
        <span>{slot}</span>
      </div>
    )}
    {!title || (
      <div className={css.title}>
        <span>{title}</span>
      </div>
    )}
    {tags > 0 && (
      <IconButton className={css.tags} onClick={onTagView}>
        <UserIcon />
      </IconButton>
    )}
  </ButtonBase>
)

const PostCard = ({ children }: PostCardProps) => <div className={css.wrapper}>{children}</div>

export const EmptyImageCard = ({
  slot,
  ratio = '8 / 10',
  onClick = () => {}
}: {
  slot: number
  ratio?: string
  onClick?: () => void
}) => (
  <ButtonBase onClick={onClick} style={{ aspectRatio: ratio }} className={css['empty-post-card']}>
    <div className={css.priority}>
      <span>{slot}</span>
    </div>
    <EmptyStateCameraIcon />
  </ButtonBase>
)

export const CategoryPostCardFooter = ({
  likeHandler,
  commentsCount,
  viewComments,
  viewLikes,
  caption,
  url,
  postId
}: PostCardFooterProps & { url?: string; postId: string }) => {
  const handleURL = useCallback(() => window.open(url, '_blank'), [url])

  const { data, refetch } = useGetCategoryPostCounts(postId)

  const onInteresting = () => {
    likeHandler()
    refetch()
  }

  return (
    <div>
      {!caption || (
        <div className={css.caption}>
          <ReadMore text={caption} tag="p" />
        </div>
      )}
      <div className={css.bottom}>
        <div className={css['like-section']}>
          <div data-btn>
            <IconButton className={data?.isInterested ? css.liked : ''} onClick={onInteresting}>
              {data?.isInterested ? <InterestedIcon /> : <InterestingIcon />}
            </IconButton>
            <IconButton aria-label="comments" onClick={viewComments}>
              <CommentsIcon />
            </IconButton>
            <IconButton>
              <SendIcon />
            </IconButton>
          </div>
          <a role="button" onClick={viewLikes}>
            {getText(data?.interestsCount)} Interesting
          </a>
          <a role="button" onClick={viewComments}>
            {commentsCount === 0 ? 'No comments yet' : getText(data?.commentsCount) + ' comments'}
          </a>
        </div>
        {!url || (
          <IconButton aria-label="save" onClick={handleURL}>
            <ExternalLink />
          </IconButton>
        )}
      </div>
    </div>
  )
}

export default PostCard
