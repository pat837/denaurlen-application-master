import { IconButton, Menu } from '@mui/material'
import { ChangeEvent, FormEvent, LegacyRef, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import postServices from '../../api-routes/posts'
import useDeleteGeneralPostComment from '../../api-routes/posts/general/comments/delete-comment'
import useFetchGeneralPostComments from '../../api-routes/posts/general/comments/fetch-comments'
import useIsLikedComment from '../../api-routes/posts/general/comments/is-liked'
import useLikeComment from '../../api-routes/posts/general/comments/like-comment'
import useFetchGeneralPostCounts from '../../api-routes/posts/general/fetch-counts'
import { dateFormat } from '../../utils'
import { ProfileContext } from '../../contexts/profile.context'
import { postActions } from '../../data/actions'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import css from '../../styles/likes-comments-drawer.module.scss'
import { commentType, storeType } from '../../types'
import DeleteIcon from '../icons/delete.icon'
import LikeIcon from '../icons/like.icon'
import LikedIcon from '../icons/liked.icon'
import MoreVerticalIcon from '../icons/more-vertical.icon'
import AvatarRing from './avatar-ring'
import Button from './button'
import DotLoader from './dot-loader'
import LikeCommentDrawer from './like-comment-drawer'

const CommentCard = ({
  commenter,
  comment,
  postedAt,
  postId,
  commentId,
  ref
}: commentType & {
  ref?: LegacyRef<HTMLDivElement>
  postId: string
  refetch: () => void
  setComment: (...a: any) => any
}) => {
  const [dispatch, { username, profilePic, _id: commenterId }, { profile }, showToast] = [
    useDispatch(),
    commenter || { username: 'Deleted Account', profilePic: '', _id: '' },
    useContext(ProfileContext),
    useToastMessage()
  ]

  const { data } = useIsLikedComment(commentId)

  const { mutate: likeCommentHandler } = useLikeComment({
    onError: () => {
      showToast('Unable to like, please try again later')
    },
    onSuccess: () => {}
  })

  const likeHandler = () => {
    if (!commentId) showToast("You can't like this comment")
    else likeCommentHandler({ commentId, postId })
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const { mutate: deleteComment } = useDeleteGeneralPostComment({
    callback: {
      success: () => {
        showToast('Comment deleted')
      },
      error: () => {
        showToast('Unable to delete, please try again later')
      }
    },
    postId
  })

  const deleteCommentHandler = () => deleteComment(commentId)

  return (
    <div ref={ref} className={css['comment-card']}>
      <div data-user style={{ flex: 1 }}>
        <AvatarRing username={username} url={profilePic} size={46} />
        <div data-commenter>
          <span />
          <span>
            {username.length > 16 ? `${username.slice(0, 13)}...` : username}
            <span data-date>{dateFormat(postedAt, true)}</span>
          </span>
          <p>{comment}</p>
        </div>
      </div>
      <div className={css['like-wrapper']}>
        {profile._id === commenterId && (
          <div>
            <IconButton
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVerticalIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-label': 'more-option'
              }}
            >
              <div className={css.more_option_menu}>
                <IconButton onClick={deleteCommentHandler}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </Menu>
          </div>
        )}
        <span>{data?.likesCount}</span>
        <IconButton aria-label="like comment" data-liked={data?.isLiked} onClick={likeHandler}>
          {data?.isLiked ? <LikedIcon /> : <LikeIcon />}
        </IconButton>
      </div>
    </div>
  )
}

const CommentsCard = ({ postId, refreshComments }: { postId: string; refreshComments: () => any }) => {
  const { commentsFor } = useSelector((state: storeType) => state.postState)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comment, setComment] = useState('')
  const [currentComment, setCurrentComment] = useState({
    postId: '',
    commentId: ''
  })

  const {
    data: comments,
    fetchNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    invalidateQuery
  } = useFetchGeneralPostComments({ postId: commentsFor, size: 20 })

  const fetchTriggerRef = useFetchNextPage({
    fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false
  })

  const onCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const comment_ = e.target.value
    setComment(comment_)
  }

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!!comment) {
      setIsSubmitting(true)

      if (!currentComment.commentId && !currentComment.postId)
        postServices
          .commentPost(commentsFor, comment)
          .then(() => {
            refreshComments()
            invalidateQuery()
            setComment('')
            setIsSubmitting(false)
            setCurrentComment({ postId: '', commentId: '' })
          })
          .catch(() => {
            setIsSubmitting(false)
          })
    }
  }

  return (
    <div className={css['comments-card-container']}>
      <div className={css['comments-card-wrapper']}>
        {isLoading ? (
          <div style={{ display: 'grid', placeItems: 'center', padding: 6 }}>
            <DotLoader />
          </div>
        ) : isError ? (
          <p>Error while fetching data...</p>
        ) : (
          comments?.pages.map((page, pageNo) => {
            const isLastPage = comments.pages.length === pageNo + 1

            return page.map(({ commenter, comment, postedAt, commentId }, _) => (
              <CommentCard
                key={commentId}
                commenter={commenter}
                comment={comment}
                postedAt={postedAt}
                isLiked={true}
                likesCount={0}
                commentId={commentId}
                refetch={invalidateQuery}
                setComment={setCurrentComment}
                postId={commentsFor}
                ref={isLastPage && _ === 15 ? fetchTriggerRef : undefined}
              />
            ))
          })
        )}
      </div>
      <div style={{ height: '48px' }} />
      <form onSubmit={submitHandler} autoComplete="off" className={css['comment-form']}>
        <input
          type="text"
          autoComplete="off"
          name={`comment-for-${postId}-at-${Date.now()}`}
          placeholder="add a comment"
          value={comment}
          onChange={onCommentChange}
        />
        <Button label="post" type="submit" loading={isSubmitting} className={css.btn} />
      </form>
    </div>
  )
}

const CommentsViewForTop10s = () => {
  const [dispatch, state] = [useDispatch(), useSelector((state: storeType) => state.postState)]

  const { data, invalidateQuery } = useFetchGeneralPostCounts(
    state.postType === 'GENERAL' ? state.commentsFor : ''
  )
  const closeHandler = () => dispatch(postActions.hideComment())

  return (
    <LikeCommentDrawer
      open={!!state.commentsFor && state.postType === 'GENERAL'}
      title={<>Comments | {data?.commentsCount}</>}
      onClose={closeHandler}
    >
      {!!state.commentsFor && state.postType === 'GENERAL' && (
        <CommentsCard postId={state.commentsFor} refreshComments={invalidateQuery} />
      )}
    </LikeCommentDrawer>
  )
}

export default CommentsViewForTop10s
