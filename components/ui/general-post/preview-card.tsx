import { ButtonBase, Skeleton, useMediaQuery } from '@mui/material'
import { LegacyRef, useState } from 'react'

import useFetchGeneralPostCounts from '../../../api-routes/posts/general/fetch-counts'
import constants from '../../../config/constants'
import css from '../../../styles/components/ui/general-post/preview-card.module.scss'
import CommentFilledIcon from '../../icons/comment-filled.icon'
import LikedIcon from '../../icons/liked.icon'
import MultiPostIcon from '../../icons/multi-post.icon'
import VideoIcon from '../../icons/video-filled.icon'
import ConditionalRender from '../conditional-render'
import Picture from '../picture'

type GeneralPostPreviewCardProps_ = {
  postId: string
  src: string
  isVideo: boolean
  onClick: () => any
  ref?: LegacyRef<HTMLDivElement>
  isMultiPost: boolean
}

const Loader = () => (
  <div className={css.loader_wrapper}>
    <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" className={css.loader} />
  </div>
)

const GeneralPostPreviewCard = ({
  src,
  isVideo,
  onClick,
  ref,
  postId,
  isMultiPost
}: GeneralPostPreviewCardProps_) => {
  const [isLoading, setLoading] = useState(true)

  const isDesktop = useMediaQuery('(hover: hover)')

  const onLoadHandler = () => setLoading(false)

  return (
    <ButtonBase aria-label="post-preview-button" onClick={onClick} className={css.preview_card}>
      <div ref={ref} className={css.wrapper}>
        {isLoading && <Loader />}
        <div className={css.post_wrapper}>
          <Picture alt="post" src={src} aspectRatio={`${constants.POST_ASPECT_RATIO}`} onLoad={onLoadHandler} />
        </div>
        <ConditionalRender condition={isMultiPost}>
          <span className={css.icon}>
            <MultiPostIcon />
          </span>
          {isVideo && (
            <span className={css.icon}>
              <VideoIcon />
            </span>
          )}
        </ConditionalRender>
        {isDesktop && <Counts postId={postId} />}
      </div>
    </ButtonBase>
  )
}

const Counts = ({ postId }: { postId: string }) => {
  const { data, isLoading } = useFetchGeneralPostCounts(postId)

  if (isLoading) return <></>

  return (
    <div className={css.preview}>
      <div className={css.w}>
        <div className={css.m}>
          <LikedIcon className={css.like} />
          <span>{data?.likesCount}</span>
        </div>
        <span>|</span>
        <div className={css.m}>
          <CommentFilledIcon />
          <span>{data?.commentsCount}</span>
        </div>
      </div>
    </div>
  )
}

export default GeneralPostPreviewCard
