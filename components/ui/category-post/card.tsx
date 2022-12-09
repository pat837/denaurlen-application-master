import css from '../../../styles/components/ui/category-post/post-card.module.scss'

import type { CategoryPost_ } from '../../../types/category-post.type'
import type { categoryType, PostUploader_ } from '../../../types'

import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { IconButton } from '@mui/material'
import { useLongPress } from 'use-long-press'
import { CSSProperties, useCallback, useContext, useState } from 'react'

import MoreHorizontalIcon from '../../icons/more-horizontal.icon'
import AvatarRing from '../avatar-ring'
import CategoryIcon from './icon'
import RippleLoader from '../ripple-loader'
import Picture from '../picture'
import { numberFormat, dateFormat, sleep } from '../../../utils'
import constants from '../../../config/constants'
import Username from '../username'
import InterestedIcon from '../../icons/interested.icon'
import InterestingIcon from '../../icons/interesting.icon'
import { CaptionSection, PostButton } from '../general-post/card'
import CommentsIcon from '../../icons/comments.icon'
import SendIcon from '../../icons/send.icon'
import ExternalLinkIcon from '../../icons/external-link.icon'
import useGetCategoryPostCounts from '../../../api-routes/posts/category/fetch-post-counts'
import { ProfileContext } from '../../../contexts/profile.context'
import { categoryPageActions, postActions } from '../../../data/actions'
import storage from '../../../config/storage'
import useInteresting from '../../../hooks/interesting.hook'
import ConditionalRender from '../conditional-render'
import useOpenPostLikes from '../../../hooks/open-post-likes.hook'
import useToastMessage from '../../../hooks/toast-message.hook'
import useSharePostMenu from '../../../hooks/share-post-menu.hook'

type PostHeader_ = {
  uploader: PostUploader_
  menuHandler: () => void
  category: categoryType
  priority: number
  place?: string
}

type PostPictureProps_ = {
  pictures: string[]
  onInterest: () => void
  isInterested: boolean
  title: string
  slot: number
}

type PostFooterProps_ = {
  postId: string
  postedAt: Date
  onInterest: () => void
  viewInterests: () => void
  viewComments: () => void
  isLoading: boolean
  isInterested: boolean
  interestingCount: number
  commentsCount: number
  link: string
}

const PostHeader = ({ uploader, category, priority, place, menuHandler }: PostHeader_) => {
  const { profile } = useContext(ProfileContext)
  const router = useRouter()
  const dispatch = useDispatch()

  const onClick = () => {
    router.push(`/${(uploader._id === profile._id && 'profile') || uploader.username}/categories/posts`)

    dispatch(categoryPageActions.setCurrentCategory(category._id))
    storage.session.add({ key: 'current-category', value: { id: category._id } })
  }

  return (
    <div className={css.post_header}>
      <div className={css.user}>
        <AvatarRing
          username={uploader.username}
          url={uploader.profilePic}
          showStories
          size={constants.POST_UPLOADER_AVATAR_SIZE}
        />
        <div className={css.username_wrapper}>
          <Username username={uploader.username} />
          {!place || <span>{place}</span>}
        </div>
      </div>
      <div className={css.icon_wrapper}>
        <div
          role="button"
          onClick={onClick}
          className={`${css.category_icon_wrapper} ${(priority === 0 && css.hide) || ''}`}
        >
          <CategoryIcon className={css.icon} categoryId={category._id} src={category.src} />
          <span className={css.priority}>{priority < 10 ? `0${priority}` : priority}</span>
        </div>
        <IconButton onClick={menuHandler}>
          <MoreHorizontalIcon />
        </IconButton>
      </div>
    </div>
  )
}

const PostPicture = ({ pictures, onInterest, isInterested, title, slot }: PostPictureProps_) => {
  const [hideTitle, setHideTitle] = useState(false)

  const toggleTitle = () => setHideTitle(!hideTitle)

  const bind = useLongPress(
    () => {
      if ('vibrate' in navigator) navigator?.vibrate(100)
      toggleTitle()
    },
    { threshold: 600 }
  )

  return (
    <div
      role="button"
      className={`${css.post_wrapper} ${(hideTitle && css.hide_title) || ''}`}
      onDoubleClick={event => {
        if (isInterested) return null
        const element = event.currentTarget
        element.classList.add(css.active_like)
        onInterest()
        sleep(1200, () => {
          element.classList.remove(css.active_like)
        })
      }}
      {...bind()}
    >
      <div>
        <RippleLoader />
      </div>
      <div className={css.snap_container} style={{ '--no-of-pictures': pictures.length } as CSSProperties}>
        {pictures.map((picture, index) => (
          <picture className={css.post} key={index}>
            <Picture
              src={picture}
              alt={`post-${index + 1}`}
              aspectRatio={`${constants.POST_ASPECT_RATIO}`}
              objectFit="contain"
            />
            <caption>{title}</caption>
            <span className={css.slot}>{slot}</span>
          </picture>
        ))}
      </div>
      <InterestedIcon className={css.like_icon} />
    </div>
  )
}

const PostFooter = ({
  postedAt,
  onInterest,
  viewComments,
  viewInterests,
  isLoading,
  interestingCount,
  commentsCount,
  isInterested,
  link,
  postId
}: PostFooterProps_) => {
  const sharePost = useSharePostMenu({ type: 'post', isForward: false, postId })
  const handleURL = useCallback(() => window.open(link, '_blank'), [link])

  return (
    <div className={css.post_footer}>
      <div className={css.footer_row}>
        <div className={css.like_comment_wrapper}>
          <PostButton
            label="interest-post"
            icon={isInterested ? <InterestedIcon /> : <InterestingIcon />}
            onClick={onInterest}
          />
          <PostButton label="comments" icon={<CommentsIcon />} onClick={viewComments} />
          <PostButton label="share" icon={<SendIcon />} onClick={sharePost} />
        </div>
        {!link || <PostButton label="go-to-link" icon={<ExternalLinkIcon />} onClick={handleURL} />}
      </div>
      <div className={css.post_details}>
        <div>
          <ConditionalRender condition={isLoading}>
            <span>Loading...</span>
            <>
              <ConditionalRender condition={interestingCount === 0}>
                <span>No interests yet</span>
                <span role="button" onClick={viewInterests}>
                  <span className={css.count}>{numberFormat(interestingCount, true)}</span> Interests
                </span>
              </ConditionalRender>
              <ConditionalRender condition={commentsCount === 0}>
                <></>
                <>
                  <span>&nbsp; | &nbsp;</span>
                  <span role="button" onClick={viewComments}>
                    <span className={css.count}>{numberFormat(commentsCount, true)}</span> Comments
                  </span>
                </>
              </ConditionalRender>
            </>
          </ConditionalRender>
        </div>
        <time>{dateFormat(postedAt)}</time>
      </div>
    </div>
  )
}

const CategoryPostCard = ({ ...post }: CategoryPost_ & { priority: number }) => {
  const [dispatch, { data, isLoading }, { profile }, showToast] = [
    useDispatch(),
    useGetCategoryPostCounts(post._id),
    useContext(ProfileContext),
    useToastMessage()
  ]

  const menuHandler = useCallback(() => {
    if (profile._id == post.uploader._id)
      dispatch(
        postActions.showMoreOptionsWithEdit({
          postId: post._id,
          caption: post.caption,
          title: post.title,
          link: post.url,
          typeOfPost: 'CATEGORY',
          categoryId: post.category._id
        })
      )
    else dispatch(postActions.showMoreOptions(post._id, post.uploader._id, 'CATEGORY'))
  }, [dispatch, post._id, post.caption, post.category._id, post.title, post.uploader._id, post.url, profile._id])

  const showMessage = (message: string) => showToast(message)

  const interestHandler = useInteresting({
    type: 'category',
    callback: {
      error: () => {
        showMessage('Unable to Interest post, try again later.')
      },
      success: () => {}
    }
  })

  const handleInteresting = () => interestHandler(post._id)

  const onViewInteresting = useOpenPostLikes({ postId: post._id, type: 'category' })
  const onViewComments = () => dispatch(postActions.showComments(post._id, 'CATEGORY'))

  return (
    <div className={css.wrapper} id={post._id}>
      <PostHeader
        uploader={post.uploader}
        menuHandler={menuHandler}
        category={post.category}
        priority={post.priority}
      />
      <PostPicture
        isInterested={data?.isInterested || false}
        onInterest={handleInteresting}
        pictures={post.src}
        slot={post.slot}
        title={post.title}
      />
      {!post.caption || <CaptionSection caption={post.caption} />}
      <PostFooter
        postId={post._id}
        commentsCount={data?.commentsCount || 0}
        interestingCount={data?.interestsCount || 0}
        isInterested={data?.isInterested || false}
        isLoading={isLoading}
        link={post.url}
        onInterest={handleInteresting}
        postedAt={post.createdAt}
        viewComments={onViewComments}
        viewInterests={onViewInteresting}
      />
    </div>
  )
}

export default CategoryPostCard
