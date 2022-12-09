import css from '../../styles/likes-comments-drawer.module.scss'

import { ChangeEvent, FormEvent, LegacyRef, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, Menu, MenuItem } from '@mui/material'

import { postActions } from '../../data/actions'
import { storeType } from '../../types'
import Button from './button'
import LikeCommentDrawer from './like-comment-drawer'
import DotLoader from './dot-loader'
import LikedIcon from '../icons/interested.icon'
import LikeIcon from '../icons/interesting.icon'
import { ProfileContext } from '../../contexts/profile.context'
import MoreVerticalIcon from '../icons/more-vertical.icon'
import useGetCategoryPostCounts from '../../api-routes/posts/category/fetch-post-counts'
import useFetchCategoryPostComments from '../../api-routes/posts/category/comments/fetch-comments'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import useCommentCategoryPost from '../../api-routes/posts/category/comments/comment-post'
import useFetchIsInterestedCategoryPostComment from '../../api-routes/posts/category/comments/is-interested'
import useInterestCategoryPostComment from '../../api-routes/posts/category/comments/interest-comment'
import useDeleteCategoryPostComment from '../../api-routes/posts/category/comments/delete-comment'
import { CategoryPostComment_ } from '../../types/category-post.type'
import Avatar from './avatar'
import { dateFormat } from '../../utils'
import useToastMessage from '../../hooks/toast-message.hook'

const CommentCard = ({
  commenter,
  comment,
  postedAt,
  postId,
  commentId,
  ref
}: CategoryPostComment_ & { postId: string; ref?: LegacyRef<HTMLDivElement> }) => {
  const [{ username, profilePic, _id: commenterId }, { profile }, showToast] = [
    commenter || { username: 'Deleted Account', profilePic: '', _id: '' },
    useContext(ProfileContext),
    useToastMessage()
  ]

  const { data } = useFetchIsInterestedCategoryPostComment({ commentId })
  const { mutate: interestComment } = useInterestCategoryPostComment({
    onError: () => {
      showToast('Unable to interest, please try again later')
    },
    onSuccess: () => {}
  })
  const { mutate: deleteComment } = useDeleteCategoryPostComment({
    postId,
    callback: {
      success: () => {},
      error: () => {
        showToast('Unable to delete, please try again later')
      }
    }
  })

  const likeHandler = () => {
    if (data?.isInterested) {
    } else if (!commentId) showToast("You can't interest this comment")
    else interestComment({ commentId, postId })
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const deleteCommentHandler = () => deleteComment({ commentId })

  return (
    <div className={css['comment-card']} ref={ref}>
      <div data-user style={{ flex: 1 }}>
        <Avatar url={profilePic} alt={username} className={css.avatar} />
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
              <MenuItem onClick={deleteCommentHandler}>Delete</MenuItem>
            </Menu>
          </div>
        )}
        <span>{data?.interestsCount || 0}</span>
        <IconButton aria-label="like comment" disabled={commentId === ''} onClick={likeHandler}>
          {data?.isInterested ? <LikedIcon /> : <LikeIcon />}
        </IconButton>
      </div>
    </div>
  )
}

const CommentsCard = ({ postId }: { postId: string }) => {
  const [state, { profile }, showToast] = [
    useSelector((state: storeType) => state.postState),
    useContext(ProfileContext),
    useToastMessage()
  ]

  const [comment, setComment] = useState('')

  const { data, isError, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useFetchCategoryPostComments({ postId, size: 20 })

  const fetchNextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  const onCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const comment_ = e.target.value
    setComment(comment_)
  }

  const { mutate: commentHandler, isLoading: isSubmitting } = useCommentCategoryPost({
    callback: {
      success: () => {
        setComment('')
      },
      error: () => {
        showToast('Unable to comment, try later')
      }
    },
    user: profile
  })

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!comment) return null
    commentHandler({ postId: state.commentsFor, comment })
  }

  return (
    <div className={css['comments-card-container']}>
      <div className={css['comments-card-wrapper']}>
        {isLoading ? (
          <div style={{ display: 'grid', placeItems: 'center', padding: 6 }}>
            <DotLoader />
          </div>
        ) : isError || !data?.pages ? (
          <p>Error while fetching data...</p>
        ) : (
          <>
            {!data?.pages.length ||
              data.pages.map((page, pageNo) => {
                const isLastPage = data.pages.length === pageNo + 1

                return page?.map((comment, indx) => (
                  <CommentCard
                    key={comment.commentId}
                    {...comment}
                    postId={postId}
                    ref={isLastPage && indx === 15 ? fetchNextPageTrigger : undefined}
                  />
                ))
              })}
            {isFetchingNextPage && (
              <div style={{ display: 'grid', placeItems: 'center', padding: 6 }}>
                <DotLoader />
              </div>
            )}
          </>
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

const CommentsView = () => {
  const [dispatch, state] = [useDispatch(), useSelector((state: storeType) => state.postState)]

  const { data, refetch } = useGetCategoryPostCounts(state.commentsFor)

  useEffect(() => {
    if (!!state.commentsFor && state.postType === 'CATEGORY') refetch()
  }, [refetch, state])

  const closeHandler = () => {
    dispatch(postActions.hideComment())
  }

  return (
    <LikeCommentDrawer
      open={!!state.commentsFor && state.postType === 'CATEGORY'}
      title={<>Comments {!!data?.commentsCount && `(${data.commentsCount})`}</>}
      onClose={closeHandler}
    >
      {!!state.commentsFor && state.postType === 'CATEGORY' && (
        <CommentsCard postId={state.commentsFor} />
      )}
    </LikeCommentDrawer>
  )
}

export default CommentsView
