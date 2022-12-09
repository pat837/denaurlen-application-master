import { ButtonBase, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { FormEvent, LegacyRef, useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import useCommentCategoryPost from '../../../api-routes/posts/category/comments/comment-post'
import useDeleteCategoryPostComment from '../../../api-routes/posts/category/comments/delete-comment'
import useFetchCategoryPostComments from '../../../api-routes/posts/category/comments/fetch-comments'
import useInterestCategoryPostComment from '../../../api-routes/posts/category/comments/interest-comment'
import useFetchIsInterestedCategoryPostComment from '../../../api-routes/posts/category/comments/is-interested'
import useGetCategoryPostCounts from '../../../api-routes/posts/category/fetch-post-counts'
import useInterestCategoryPost from '../../../api-routes/posts/category/interest-post'
import { dateFormat, sleep } from '../../../utils'
import { getMediaURL } from '../../../utils/get-url'
import { ProfileContext } from '../../../contexts/profile.context'
import { postActions, postPopupActions } from '../../../data/actions'
import useFetchNextPage from '../../../hooks/fetch-next-page.hook'
import useOpenPostLikes from '../../../hooks/open-post-likes.hook'
import usePopup from '../../../hooks/popup.hook'
import useToastMessage from '../../../hooks/toast-message.hook'
import css from '../../../styles/components/ui/category-post-popup.module.scss'
import { CategoryPostComment_, FetchPostsByCategory_ } from '../../../types/category-post.type'
import ExternalLinkIcon from '../../icons/external-link.icon'
import InterestedIcon from '../../icons/interested.icon'
import InterestingIcon from '../../icons/interesting.icon'
import MoreVerticalIcon from '../../icons/more-vertical.icon'
import SendIcon from '../../icons/send.icon'
import Avatar from '../../ui/avatar'
import AvatarRing from '../../ui/avatar-ring'
import Button from '../../ui/button'
import DotLoader from '../../ui/dot-loader'
import Image from '../../ui/picture'
import ReadMore from '../../ui/read-more'
import PostPopup from '../post-popup/post.popup'
import useSharePostMenu from '../../../hooks/share-post-menu.hook'

type CategoryPostPopupProps_ = {
  data: FetchPostsByCategory_
}

type FooterSectionProps_ = {
  postId: string
  url: string
  createdAt: Date
}

const CategoryPostPopup = ({ data }: CategoryPostPopupProps_) => {
  const [isDesktop, dispatch, { profile, categories }, router, { isOpen, closePopup }, showToast] = [
    useMediaQuery('(min-width: 1024px)'),
    useDispatch(),
    useContext(ProfileContext),
    useRouter(),
    usePopup(),
    useToastMessage()
  ]

  const [index, setIndex] = useState(parseInt(`${router.query.post}`) || 0)

  useEffect(() => {
    setIndex(parseInt(`${router.query.post}`) || 0)
  }, [router])

  const { data: counts } = useGetCategoryPostCounts(data[index]._id)

  const getCategoryIcon = () => {
    const category = categories.find(({ category }) => category._id === data[index].category._id)

    if (category === undefined) return <></>

    const priority = `${category.priority < 10 ? '0' : ''}${category.priority}`

    return (
      <div className={css.category_icon}>
        <div>
          <Image
            src={category.category.src}
            alt={category.category.name}
            width="26px"
            height="26px"
            aspectRatio="1"
          />
        </div>
        <span>{priority}</span>
      </div>
    )
  }

  const menuHandler = () => {
    if (profile._id === data[index].uploader._id)
      dispatch(
        postActions.showMoreOptionsWithEdit({
          postId: data[index]._id,
          caption: data[index].caption,
          typeOfPost: 'CATEGORY',
          link: data[index].url,
          title: data[index].title,
          categoryId: data[index].category._id
        })
      )
    else dispatch(postActions.showMoreOptions(data[index]._id, data[index].uploader._id, 'CATEGORY'))
  }

  const { mutate: interestHandler } = useInterestCategoryPost({
    errorCallback: () => {
      showToast('Unable to interest, please try later')
    },
    successCallback: () => {}
  })

  const likeHandler = () => interestHandler(data[index]._id)

  const closeHandler = () => dispatch(postPopupActions.closePost())

  const nextHandler = () => setIndex(data.length === index + 1 ? 0 : index + 1)

  const prevHandler = () => setIndex((index === 0 ? data.length : index) - 1)

  const goToProfile = () => {
    router.push(`/${data[index].uploader.username}`)
    closeHandler()
  }

  return (
    <PostPopup
      onLeftArrowClick={prevHandler}
      onRightArrowClick={nextHandler}
      maxWidth="xl"
      isOpen={isDesktop && isOpen('category-post-popup')}
      onClose={closePopup}
    >
      <div className={css.wrapper}>
        <ButtonBase
          className={css['image-wrapper']}
          style={{ backgroundImage: `url('${getMediaURL(data[index].src[0])}')` }}
          onDoubleClick={event => {
            if (counts?.isInterested) return null
            const element = event.currentTarget
            element.classList.add(css.active_like)
            likeHandler()
            sleep(1200, () => {
              element.classList.remove(css.active_like)
            })
          }}
        >
          <InterestedIcon className={css.like_icon} />
          <div className={css.title}>
            <span>{data[index].title}</span>
          </div>
          <div className={css.slot}>
            <span>{data[index].slot}</span>
          </div>
        </ButtonBase>
        <div className={css.post}>
          <div className={css.header}>
            <div className={css.profile} role="button" tabIndex={0} onClick={goToProfile}>
              <AvatarRing
                url={data[index].uploader.profilePic}
                username={data[index].uploader.username}
                showStories
                size={46}
              />
              <div>
                <p>{data[index].uploader.username}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {getCategoryIcon()}
              <IconButton aria-label="more-options" onClick={menuHandler}>
                <MoreVerticalIcon />
              </IconButton>
            </div>
          </div>
          {isOpen('category-post-popup') && <CommentSection postId={data[index]._id} />}
          {!data[index].caption || (
            <p className={css.caption}>
              <ReadMore text={data[index].caption} maxLength={50} />
            </p>
          )}
          <FooterSection postId={data[index]._id} createdAt={data[index].createdAt} url={data[index].url} />
        </div>
      </div>
    </PostPopup>
  )
}

const CommentCard = ({
  commenter,
  comment,
  postedAt,
  postId,
  commentId,
  ref
}: CategoryPostComment_ & { postId: string; ref?: LegacyRef<HTMLDivElement> }) => {
  const [dispatch, { username, profilePic, _id: commenterId }, { profile }, showToast] = [
    useDispatch(),
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
    if (data?.isInterested) return null

    if (!commentId) return showToast("You can't interest this comment")

    interestComment({ commentId, postId })
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
            {username}
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
        <IconButton aria-label="interest-comment" disabled={commentId === ''} onClick={likeHandler}>
          {data?.isInterested ? <InterestedIcon /> : <InterestingIcon />}
        </IconButton>
      </div>
    </div>
  )
}

const CommentSection = ({ postId }: { postId: string }) => {
  const [comment, setComment] = useState('')

  const [{ profile }, showToast] = [useContext(ProfileContext), useToastMessage()]

  const { data, isError, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useFetchCategoryPostComments(
    { postId, size: 20 }
  )

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

  const fetchNextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!comment) return null
    commentHandler({ postId, comment })
  }

  return (
    <div className={css['comment-section']}>
      <div className={css['comments-wrapper']}>
        {isLoading ? (
          <div style={{ display: 'grid', placeItems: 'center', padding: 6 }}>
            <DotLoader />
          </div>
        ) : isError && !data?.pages.length ? (
          <p>Error while fetching data...</p>
        ) : (
          <>
            {!data?.pages.length ||
              data.pages.map((page, pageNo) => {
                const isLastPage = data.pages.length === pageNo + 1

                return page.map((comment, indx) => (
                  <div key={comment.commentId} ref={isLastPage && indx === 15 ? fetchNextPageTrigger : undefined}>
                    <CommentCard {...comment} postId={postId} />
                  </div>
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
      <form onSubmit={submitHandler} autoComplete="off">
        <input
          placeholder="add a comment"
          type="text"
          name={`comment-for-${postId}-at-${Date.now()}`}
          value={comment}
          onInput={e => setComment(e.currentTarget.value as string)}
        />
        <Button label="post" type="submit" loading={isSubmitting} className={css.btn} />
      </form>
    </div>
  )
}

const FooterSection = ({ createdAt, postId, url }: FooterSectionProps_) => {
  const showToast = useToastMessage()
  const { data: counts, isLoading } = useGetCategoryPostCounts(postId)
  const sharePost = useSharePostMenu({ type: 'post', isForward: false, postId })

  const { mutate: interestHandler } = useInterestCategoryPost({
    errorCallback: () => {
      showToast('Unable to interest, please try later')
    },
    successCallback: () => {}
  })

  const likeHandler = () => interestHandler(postId)

  const viewLikes = useOpenPostLikes({ postId, type: 'category' })

  const handleURL = useCallback(() => window.open(url, '_blank'), [url])

  return (
    <div className={css.footer}>
      <div className={css['btn-wrapper']}>
        <div>
          <IconButton className={css.button} edge="start" onClick={likeHandler}>
            {counts?.isInterested ? <InterestedIcon /> : <InterestingIcon />}
          </IconButton>
          <IconButton className={css.button} onClick={sharePost}>
            <SendIcon />
          </IconButton>
        </div>
        {!url || (
          <IconButton className={css.button} edge="end" onClick={handleURL}>
            <ExternalLinkIcon />
          </IconButton>
        )}
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={css.counts}>
          <a onClick={viewLikes}>
            {!counts?.interestsCount ? (
              ' No one interested yet'
            ) : (
              <>
                <span>{counts.interestsCount}</span> Interested
              </>
            )}
          </a>
          {' | '}
          <a>
            {!counts?.commentsCount ? (
              ' No comments yet'
            ) : (
              <>
                <span>{counts.commentsCount}</span> Comments
              </>
            )}
          </a>
          <time>{dateFormat(createdAt)}</time>
        </div>
      )}
    </div>
  )
}

export default CategoryPostPopup
