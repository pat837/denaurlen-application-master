import { useMediaQuery } from '@mui/material'
import { useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useGetTags from '../../api-routes/posts/general/fetch-tags'
import { postActions } from '../../data/actions'
import css from '../../styles/post.module.scss'
import { storeType } from '../../types'
import AvatarRing from './avatar-ring'
import DialogBox from './dialog-box'
import DotLoader from './dot-loader'
import LikeCommentDrawer from './like-comment-drawer'

const LikesCards = () => {
  const state = useSelector((state: storeType) => state.postState)

  const {
    data,
    isLoading,
    isFetchingNextPage: isFetching,
    hasNextPage,
    fetchNextPage
  } = useGetTags(state.tagsFor, 10)

  const observer = useRef<any>()
  const lastLikeCardRef = useCallback(
    (node: any) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !!data && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [data, fetchNextPage, hasNextPage, isLoading]
  )

  if (isLoading || !data)
    return (
      <div className={css['like-card-wrapper']}>
        <div style={{ display: 'grid', placeItems: 'center', padding: 6 }}>
          <DotLoader />
        </div>
      </div>
    )

  return (
    <div className={css['like-card-wrapper']}>
      {data.pages.map(({ username, _id, name, profilePic }, index) => {
        if (data.pages.length === index + 1)
          return (
            <div ref={lastLikeCardRef} className={css['like-card']} key={_id}>
              <AvatarRing size={46} url={profilePic} username={username} />
              <div data-user>
                <p>{username}</p>
                <span>{name}</span>
              </div>
            </div>
          )

        return (
          <div className={css['like-card']} key={_id}>
            <AvatarRing size={46} url={profilePic} username={username} />
            <div data-user>
              <p>{username}</p>
              <span>{name}</span>
            </div>
          </div>
        )
      })}
      {isFetching && (
        <div style={{ display: 'grid', placeItems: 'center', padding: 6 }}>
          <DotLoader />
        </div>
      )}
    </div>
  )
}

const TagsViewDrawer = () => {
  const [dispatch, state] = [useDispatch(), useSelector((state: storeType) => state.postState)]

  const closeHandler = () => {
    dispatch(postActions.hideTags())
  }

  return (
    <LikeCommentDrawer open={!!state.tagsFor} title={'Tagged People'} onClose={closeHandler}>
      {!!state.tagsFor && <LikesCards />}
    </LikeCommentDrawer>
  )
}

const TagsViewDialog = () => {
  const [dispatch, state] = [useDispatch(), useSelector((state: storeType) => state.postState)]

  const closeHandler = () => {
    dispatch(postActions.hideTags())
  }

  return (
    <DialogBox isOpen={!!state.tagsFor} titleSection={'Tagged People'} onClose={closeHandler}>
      <div style={{ minWidth: 300 }}>{!!state.tagsFor && <LikesCards />}</div>
    </DialogBox>
  )
}

const TagsView = () => {
  const isDesktop = useMediaQuery('(min-width: 722px)')

  return isDesktop ? <TagsViewDialog /> : <TagsViewDrawer />
}

export default TagsView
