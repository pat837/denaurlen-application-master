import css from './../../../styles/components/ui/valuation/comments-popup.module.scss'

import { FormEvent, useRef, useCallback, ComponentProps, useContext, useState } from 'react'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../button'
import LikeCommentDrawer from '../like-comment-drawer'
import useCommentOnValuationPost from '../../../api-routes/posts/valuation/post-comment'
import { postActions } from '../../../data/actions'
import { Comment_, storeType } from '../../../types'
import useGetValuationPostComments from '../../../api-routes/posts/valuation/get-comments'
import DotLoader from '../dot-loader'
import AvatarRing from '../avatar-ring'
import Username from '../username'
import { dateFormat } from '../../../utils'
import InterestedIcon from '../../icons/interested.icon'
import InterestingIcon from '../../icons/interesting.icon'
import { ProfileContext } from '../../../contexts/profile.context'
import MoreVerticalIcon from '../../icons/more-vertical.icon'
import useDeleteValuationPostComment from '../../../api-routes/posts/valuation/delete-comment'
import useIsValuationCommentInterested from '../../../api-routes/posts/valuation/is-interested-comment'
import valuationPostQueries from '../../../api-routes/posts/valuation'
import useToastMessage from '../../../hooks/toast-message.hook'

export const CommentCard = ({
  comment,
  commentId,
  commenter,
  postedAt,
  postId,
  ...rest
}: Comment_ & { postId: string } & ComponentProps<'div'>) => {
  const [{ profile }, dispatch, showToast] = [
    useContext(ProfileContext),
    useDispatch(),
    useToastMessage()
  ]

  const { data, refetch } = useIsValuationCommentInterested(commentId)

  const { mutate: DeleteHandler } = useDeleteValuationPostComment({
    onSuccess: () => {},
    onError: () => {
      showToast('Unable to delete comment, try later')
    }
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const onDelete = () => DeleteHandler({ postId, commentId })

  const onInterest = () => {
    valuationPostQueries.comment
      .interest({ postId, commentId })
      .then(() => refetch())
      .catch(() => null)
  }

  return (
    <div className={css.comment_card} {...rest}>
      <div className={css.comment_section}>
        <AvatarRing size={40} username={commenter.username} url={commenter.profilePic} />
        <div className={css.comment_wrapper}>
          <div className={css.username_wrapper}>
            <Username className={css.username} username={commenter.username} />
            <time>&nbsp; • &nbsp;{dateFormat(postedAt, true)}</time>
          </div>
          <p className={css.comment}>{comment}</p>
        </div>
      </div>
      <div>
        <div>
          {profile._id === commenter._id && (
            <>
              <IconButton
                id="option-button"
                aria-label="more-option"
                aria-controls={open ? 'option-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <MoreVerticalIcon />
              </IconButton>
              <Menu
                id="option-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'option-button'
                }}
              >
                <MenuItem onClick={onDelete}>Delete</MenuItem>
              </Menu>
            </>
          )}
          <span>{data?.interestsCount}</span>
          <IconButton aria-label="interesting" edge="end" onClick={onInterest}>
            {data?.isInterested ? <InterestedIcon /> : <InterestingIcon />}
          </IconButton>
        </div>
      </div>
    </div>
  )
}

const Comments = ({ postId }: { postId: string }) => {
  const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetValuationPostComments(postId)

  const observer = useRef<any>()
  const lastCommentsCardRef = useCallback(
    (node: any) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !!data && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [data, fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  if (isLoading)
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: 28 }}>
        <DotLoader />
      </div>
    )

  if (data === undefined || (isError && !data?.pages.length))
    return (
      <div className={css.message}>
        <p>Error while fetching comments</p>
      </div>
    )

  if (data.pages[0].length === 0)
    return (
      <div className={css.message}>
        <p>No Comments yet</p>
      </div>
    )

  return (
    <>
      {data.pages.map((page, index) => {
        const isLastPage = index + 1 === data.pages.length
        return page.map((comment, index) => {
          if (isLastPage && index === 20)
            return (
              <CommentCard
                key={comment.commentId}
                postId={postId}
                {...comment}
                ref={lastCommentsCardRef}
              />
            )

          return <CommentCard key={comment.commentId} postId={postId} {...comment} />
        })
      })}
    </>
  )
}

const ValuationCommentsPopup = () => {
  const [inputRef, dispatch, { commentsFor, postType }, showToast] = [
    useRef<HTMLInputElement>(null),
    useDispatch(),
    useSelector((store: storeType) => store.postState),
    useToastMessage()
  ]

  const closeHandler = () => dispatch(postActions.hideComment())

  const { mutate: postComment, isLoading } = useCommentOnValuationPost({
    onSuccess: () => {
      if (!!inputRef.current?.value) inputRef.current.value = ''
    },
    onError: () => {
      showToast('Unable to post comment, try again later')
    }
  })

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const comment = inputRef.current
    if (comment === null) return null
    if (!comment.value?.trim) return null

    postComment({ postId: commentsFor, comment: comment.value })
  }

  return (
    <LikeCommentDrawer
      title={'Comments'}
      open={!!commentsFor && postType == 'VALUATION'}
      onClose={closeHandler}
    >
      <div className={css.wrapper}>
        {!!commentsFor && postType == 'VALUATION' && <Comments postId={commentsFor} />}
        <form autoComplete="off" onSubmit={submitHandler}>
          <input type="text" ref={inputRef} placeholder="Add a comment" />
          <Button label="post" type="submit" className={css.post_btn} loading={isLoading} />
        </form>
      </div>
    </LikeCommentDrawer>
  )
}

export default ValuationCommentsPopup
