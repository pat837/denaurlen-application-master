import { ButtonBase, IconButton, useMediaQuery } from '@mui/material'
import { CSSProperties, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useFetchGeneralPostCounts from '../../../api-routes/posts/general/fetch-counts'
import useLikeGeneralPost from '../../../api-routes/posts/general/like-post'
import useSaveGeneralPost from '../../../api-routes/posts/general/save-post'
import constants from '../../../config/constants'
import { ProfileContext } from '../../../contexts/profile.context'
import { postActions } from '../../../data/actions'
import useInViewport from '../../../hooks/in-viewport.hook'
import useOpenPostLikes from '../../../hooks/open-post-likes.hook'
import useSharePostMenu from '../../../hooks/share-post-menu.hook'
import useToastMessage from '../../../hooks/toast-message.hook'
import css from '../../../styles/components/ui/general-post/post-card.module.scss'
import { genPostCountsResponseType, PostUploader_, storeType } from '../../../types'
import { GeneralPost_ } from '../../../types/general-post.types'
import { dateFormat, numberFormat, sleep } from '../../../utils'
import { getMediaURL } from '../../../utils/get-url'
import BookMarkFilledIcon from '../../icons/bookmark-filled.icon'
import BookMarkIcon from '../../icons/bookmark.icon'
import ChevronLeftIcon from '../../icons/chevron-left.icon'
import ChevronRightIcon from '../../icons/chevron-right.icon'
import CommentsIcon from '../../icons/comments.icon'
import LikeIcon from '../../icons/like.icon'
import LikedIcon from '../../icons/liked.icon'
import MoreHorizontalIcon from '../../icons/more-horizontal.icon'
import SendIcon from '../../icons/send.icon'
import UserIcon from '../../icons/user.icon'
import AvatarRing from '../avatar-ring'
import ConditionalRender from '../conditional-render'
import Picture from '../picture'
import ReadMore from '../read-more'
import RippleLoader from '../ripple-loader'
import Username from '../username'

type CardHeadProps_ = {
  uploader: PostUploader_
  place: string
  menuHandler: () => void
}

type PostPictureProps_ = {
  pictures: string[]
  aspectRatio: number
  onLike: () => void
  isLiked: boolean
  hasTags: boolean
  viewTags: () => any
  thumbnail: string
}

type PostButtonProps_ = {
  icon: ReactNode
  label: string
  onClick: () => void
}

type PostFooterProps_ = {
  uploaderId: string
  postId: string
  postedAt: Date
  onLike: () => void
  viewLikes: () => void
  viewComments: () => void
  counts: genPostCountsResponseType
  isLoading: boolean
}

const COUNTS_Data = {
  isLiked: false,
  isSaved: false,
  commentsCount: 0,
  likesCount: 0,
  tagsCount: 0
}

export const PostButton = ({ icon, label, onClick }: PostButtonProps_) => (
  <ButtonBase aria-label={label} onClick={onClick} disableRipple className={css.post_button}>
    {icon}
  </ButtonBase>
)

const CardHead = ({ uploader: { profilePic, username }, place, menuHandler }: CardHeadProps_) => (
  <div className={css.card_header}>
    <div className={css.profile_section}>
      <AvatarRing username={username} url={profilePic} size={constants.POST_UPLOADER_AVATAR_SIZE} showStories />
      <div>
        <Username username={username} />
        {!place || <span>{place}</span>}
      </div>
    </div>
    <IconButton onClick={menuHandler}>
      <MoreHorizontalIcon />
    </IconButton>
  </div>
)

const PostPicture = ({ pictures, aspectRatio, onLike, isLiked, hasTags, viewTags }: PostPictureProps_) => {
  const [{ ratio, isMultiple, currentIndex }, setState] = useState({
    ratio:
      aspectRatio == 1
        ? 1
        : 4 / 3 <= aspectRatio && aspectRatio <= 4 / 5
        ? aspectRatio
        : Math.abs(4 / 3 - aspectRatio) < Math.abs(4 / 5 - aspectRatio)
        ? 4 / 3
        : 4 / 5,
    isMultiple: pictures.length > 1,
    currentIndex: 0
  })

  const picturesRef = useRef<HTMLDivElement | null>(null)
  const isDesktop = useMediaQuery('(hover: hover)')

  const navigateHandler = (type: 'RIGHT' | 'LEFT') => () => {
    if (picturesRef.current) {
      picturesRef.current.scrollTo({
        left: (currentIndex + 1 * (type === 'RIGHT' ? 1 : -1)) * picturesRef.current.clientWidth,
        behavior: 'smooth'
      })
    }
  }

  const navigate = (index: number) => () => {
    if (picturesRef.current)
      picturesRef.current.scrollTo({
        left: index * picturesRef.current.clientWidth,
        behavior: 'smooth'
      })
  }

  useEffect(() => {
    if (isMultiple && picturesRef.current) {
      const wrapper = picturesRef.current

      const wrapperWidth = wrapper.clientWidth
      const pictures = wrapper.querySelectorAll<HTMLDivElement>(`.${css.post}`)

      const eventHandler = () => {
        const scrollLeft = wrapper.scrollLeft

        pictures.forEach((picture, index) => {
          if (
            picture.offsetLeft < scrollLeft + wrapperWidth / 2 &&
            scrollLeft < picture.offsetLeft + wrapperWidth / 2
          )
            setState(state => ({ ...state, currentIndex: index }))
        })
      }

      wrapper.addEventListener('scroll', eventHandler)

      return () => wrapper.removeEventListener('scroll', eventHandler)
    }
  }, [isMultiple])

  return (
    <>
      <div
        role="button"
        className={css.post_wrapper}
        style={{ '--aspect-ratio': ratio } as CSSProperties}
        onDoubleClick={event => {
          if (isLiked) return null
          const element = event.currentTarget
          element.classList.add(css.active_like)
          onLike()
          sleep(1200, () => {
            element.classList.remove(css.active_like)
          })
        }}
      >
        <div>
          <RippleLoader />
        </div>
        <div
          className={css.snap_container}
          style={{ '--no-of-pictures': pictures.length } as CSSProperties}
          ref={picturesRef}
        >
          {pictures.map((picture, index) => (
            <div className={css.post} key={index}>
              <Picture src={picture} alt={`post-${index + 1}`} aspectRatio={`${ratio}`} objectFit="contain" />
            </div>
          ))}
        </div>
        <LikedIcon className={css.like_icon} />
        {hasTags && (
          <div className={css.tag_icon} onClick={viewTags}>
            <UserIcon />
          </div>
        )}
        {isMultiple && (
          <span className={css.indicator}>
            {currentIndex + 1} / {pictures.length}
          </span>
        )}
        {isMultiple && isDesktop && (
          <>
            <div
              role="button"
              aria-label="scroll-left"
              className={`${css.arrows_btn} ${css.left}`}
              onClick={navigateHandler('LEFT')}
            >
              <ChevronLeftIcon />
            </div>
            <div
              role="button"
              aria-label="scroll-right"
              className={`${css.arrows_btn} ${css.right}`}
              onClick={navigateHandler('RIGHT')}
            >
              <ChevronRightIcon />
            </div>
          </>
        )}
      </div>
      {isMultiple && (
        <div className={css.indicator_wrapper}>
          {pictures.map((picture, indx) => (
            <span
              key={indx}
              className={`${css.dot} ${indx === currentIndex && css.active}`}
              onClick={navigate(indx)}
            />
          ))}
        </div>
      )}
    </>
  )
}

const PostVideo = ({
  isLiked,
  onLike,
  pictures: videos,
  aspectRatio,
  hasTags,
  viewTags,
  thumbnail
}: PostPictureProps_) => {
  const { isMuted } = useSelector((state: storeType) => state.postState)

  const [{ ratio, autoPlay, videoLoaded }, setState] = useState({
    ratio:
      4 / 3 <= aspectRatio && aspectRatio <= 4 / 5
        ? aspectRatio
        : Math.abs(4 / 3 - aspectRatio) < Math.abs(4 / 5 - aspectRatio)
        ? 4 / 3
        : 4 / 5,
    autoPlay: true,
    videoLoaded: false
  })

  const videoElement = useInViewport({ threshold: 1.0, rootMargin: '-10px 0px -60px 0px' })

  const toggleVideoHandler = () => setState(state => ({ ...state, autoPlay: !state.autoPlay }))

  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current[videoElement.isVisible && autoPlay ? 'play' : 'pause']()
  }, [videoElement.isVisible, videoRef, autoPlay])

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted
  }, [isMuted])

  return (
    <div
      role="button"
      className={css.post_wrapper}
      style={{ '--aspect-ratio': ratio } as CSSProperties}
      onDoubleClick={event => {
        if (isLiked) return null
        const element = event.currentTarget
        element.classList.add(css.active_like)
        onLike()
        sleep(1200, () => {
          element.classList.remove(css.active_like)
        })
      }}
    >
      {videoLoaded || (
        <div>
          <RippleLoader />
        </div>
      )}
      <div className={css.snap_container} style={{ '--no-of-pictures': videos.length } as CSSProperties}>
        {videos.map((video, index) => (
          <div key={index} ref={videoElement.ref} className={css.post}>
            <video
              loop
              controls
              controlsList="nodownload"
              playsInline
              preload="none"
              muted={isMuted}
              className={css.video}
              ref={videoRef}
              onClick={toggleVideoHandler}
              onLoadedData={() => setState(state => ({ ...state, videoLoaded: true }))}
              poster={getMediaURL(thumbnail)}
            >
              <source src={getMediaURL(video)} />
            </video>
          </div>
        ))}
      </div>
      {hasTags && (
        <div className={css.tag_icon} onClick={viewTags}>
          <UserIcon />
        </div>
      )}
      <LikedIcon className={css.like_icon} />
    </div>
  )
}

export const CaptionSection = ({ caption }: { caption: string }) => (
  <div className={css.caption_wrapper}>
    <div className={css.caption}>
      <ReadMore text={caption} tag="p" />
    </div>
  </div>
)

const PostFooter = ({
  postId,
  postedAt,
  onLike,
  viewComments,
  viewLikes,
  counts: { isLiked, isSaved, commentsCount, likesCount },
  isLoading,
  uploaderId
}: PostFooterProps_) => {
  const { mutate: savePost } = useSaveGeneralPost({ onError: () => {}, onSuccess: () => {} })
  const sharePost = useSharePostMenu({ type: 'post', isForward: false, postId })

  const savePostHandler = () => savePost(postId)

  const showToast = useToastMessage()

  return (
    <div className={css.post_footer}>
      <div className={css.footer_row}>
        <div className={css.like_comment_wrapper}>
          <PostButton label="like" icon={isLiked ? <LikedIcon /> : <LikeIcon />} onClick={onLike} />
          <PostButton label="comments" icon={<CommentsIcon />} onClick={viewComments} />
          <PostButton label="share" icon={<SendIcon />} onClick={sharePost} />
        </div>
        <PostButton
          label="save-post"
          icon={isSaved ? <BookMarkFilledIcon /> : <BookMarkIcon />}
          onClick={savePostHandler}
        />
      </div>
      <div className={css.post_details}>
        <div>
          <ConditionalRender condition={isLoading}>
            <span>Loading...</span>
            <>
              <ConditionalRender condition={likesCount === 0}>
                <span>No likes yet</span>
                <span>
                  <span role="button" onClick={viewLikes}>
                    <span className={css.count}>{numberFormat(likesCount, true)}</span> Likes
                  </span>
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

const GeneralPostCard = (post: GeneralPost_) => {
  const [dispatch, { profile }, viewPostLikes, showToast] = [
    useDispatch(),
    useContext(ProfileContext),
    useOpenPostLikes({ type: 'general', postId: post._id }),
    useToastMessage()
  ]

  const { data: counts, isLoading } = useFetchGeneralPostCounts(post._id)

  const { mutate: likePost } = useLikeGeneralPost({
    onError: () => {
      showToast('Something went wrong')
    },
    onSuccess: () => {}
  })

  const likeHandler = useCallback(() => likePost({ postId: post._id }), [likePost, post._id])

  const menuHandler = useCallback(() => {
    if (profile._id == post.uploader._id)
      dispatch(postActions.showMoreOptionsWithEdit({ postId: post._id, caption: post.caption }))
    else dispatch(postActions.showMoreOptions(post._id, post.uploader._id))
  }, [dispatch, post._id, post.caption, post.uploader._id, profile._id])

  const viewLikes = useCallback(viewPostLikes, [viewPostLikes])

  const viewTags = useCallback(() => {
    dispatch(postActions.showTags(post._id))
  }, [dispatch, post._id])

  const viewComments = useCallback(() => {
    dispatch(postActions.showComments(post._id))
  }, [dispatch, post._id])

  return (
    <div className={css.card}>
      <CardHead menuHandler={menuHandler} uploader={post.uploader} place={post.place} />
      <ConditionalRender condition={post.isVideo}>
        <PostVideo
          pictures={post.src}
          aspectRatio={post.ratio}
          isLiked={counts?.isLiked || false}
          onLike={likeHandler}
          hasTags={!!counts?.tagsCount}
          viewTags={viewTags}
          thumbnail={post.isVideo ? post.thumbnail : ''}
        />
        <PostPicture
          pictures={post.src}
          aspectRatio={post.ratio}
          isLiked={counts?.isLiked || false}
          onLike={likeHandler}
          hasTags={!!counts?.tagsCount}
          viewTags={viewTags}
          thumbnail={post.isVideo ? post.thumbnail : ''}
        />
      </ConditionalRender>
      {!post.caption || <CaptionSection caption={post.caption} />}
      <PostFooter
        uploaderId={post.uploader._id}
        postId={post._id}
        postedAt={post.createdAt}
        onLike={likeHandler}
        viewComments={viewComments}
        viewLikes={viewLikes}
        counts={counts || COUNTS_Data}
        isLoading={isLoading}
      />
    </div>
  )
}

export default GeneralPostCard
