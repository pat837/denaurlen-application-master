import { ButtonBase } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { addPostActions } from '../../data/actions'
import EmptyStateCameraIcon from '../icons/empty-state-camera.icon'
import css from './../../styles/categories-page.module.scss'
import Image from './picture'
import PostCard, { EmptyImageCard, PostCardHeader } from './post-card-old'

export const EmptyCategoryPostCard = ({
  userId,
  profilePic,
  username,
  categoryIcon,
  slot,
  categoryId,
  enableClick
}: {
  userId: string
  profilePic: string
  username: string
  slot: number
  categoryIcon: ReactNode
  categoryId: string
  enableClick?: boolean
}) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleClick = useCallback(() => {
    if (enableClick) {
      dispatch(addPostActions.selectCategory(categoryId))
      dispatch(addPostActions.selectCategorySlot(slot))
      dispatch(addPostActions.setCurrentPage(router.asPath))
      router.replace('/uploads/category-post')
    }
  }, [categoryId, dispatch, enableClick, router, slot])

  return (
    <PostCard>
      <PostCardHeader
        userId={userId}
        profilePic={profilePic}
        username={username}
        menuHandler={() => null}
        categoryIcon={categoryIcon}
      />
      <EmptyImageCard slot={slot} onClick={handleClick} />
    </PostCard>
  )
}

export const CategoryPostPreviewCard = ({
  src,
  slotNo,
  title,
  onClick
}: {
  src: string
  slotNo: number
  title?: string
  onClick: () => any
}) => (
  <ButtonBase className={css['category-preview-card']} onClick={onClick}>
    <div className={css['preview-card-wrapper']}>
      <Image src={src} alt={title || 'Post'} width="100%" aspectRatio="8.5 / 11" quality={60} />
      <div className={css.slot}>
        <span>{slotNo}</span>
      </div>
      {!title || (
        <div className={css.title}>
          <span>{title}</span>
        </div>
      )}
    </div>
  </ButtonBase>
)

export const EmptyCategoryPostPreviewCard = ({
  slotNo,
  categoryId,
  enableClick = false
}: {
  slotNo: number
  categoryId: string
  enableClick?: boolean
}) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleClick = useCallback(() => {
    if (enableClick) {
      dispatch(addPostActions.selectCategory(categoryId))
      dispatch(addPostActions.selectCategorySlot(slotNo))
      dispatch(addPostActions.setCurrentPage(router.asPath))
      router.replace('/uploads/category-post')
    }
  }, [categoryId, dispatch, enableClick, router, slotNo])

  return (
    <ButtonBase className={css['category-preview-card']} onClick={handleClick}>
      <div className={css['preview-card-wrapper']}>
        {enableClick && (
          <div className={css.add_post}>
            <span>Add Post</span>
          </div>
        )}
        <div className={css.slot}>
          <span>{slotNo}</span>
        </div>
        <div className={css['empty-state']}>
          <EmptyStateCameraIcon />
        </div>
      </div>
    </ButtonBase>
  )
}
