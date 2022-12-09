import { ButtonBase } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import postServices from '../../api-routes/posts'
import useDeleteCategoryPost from '../../api-routes/posts/category/delete-category-post'
import useDeleteGeneralPost from '../../api-routes/posts/general/delete-post'
import { queryClient } from '../../config/query-client'
import { ProfileContext } from '../../contexts/profile.context'
import { postActions, postPopupActions } from '../../data/actions'
import useToastMessage from '../../hooks/toast-message.hook'
import newCSS from '../../styles/components/ui/post-option-popup.module.scss'
import { storeType } from '../../types'
import DeleteIcon from '../icons/delete.icon'
import EditIcon2 from '../icons/edit2.icon'
import LinkIcon from '../icons/link.icon'
import ShareIcon from '../icons/share.icon'
import Button from './button'
import Popup from './popup'

export const MoreOptionsWithEdit = () => {
  const [dispatch, { moreOptionsWithEditFor, postType, categoryId }, router, { profile }, showToast] = [
    useDispatch(),
    useSelector((state: storeType) => state.postState),
    useRouter(),
    useContext(ProfileContext),
    useToastMessage()
  ]

  const [{ showConfirmDelete, isDeleting }, setState] = useState({
    showConfirmDelete: false,
    isDeleting: false
  })

  const closeHandler = () => {
    if (isDeleting) return null
    dispatch(postActions.hideMoreOptionsWithEdit())
    setState(state => ({ ...state, showConfirmDelete: false }))
  }
  const showMessage = useCallback((message: string) => showToast(message), [showToast])

  const toastHandler = (message: string) => showToast(message)

  const copyLinkHandler = useCallback(() => {
    const type = {
      GENERAL: 'general',
      CATEGORY: 'category',
      VALUATION: 'valuation'
    }

    navigator.clipboard.writeText(
      `${window.location.origin}/post/${type[postType]}/${moreOptionsWithEditFor}`
    )

    showMessage('Copied Link')
  }, [moreOptionsWithEditFor, postType, showMessage])

  const onCopyLink = () => {
    closeHandler()
    copyLinkHandler()
  }

  const shareHandler = useCallback(() => {
    const type = {
      GENERAL: 'general',
      CATEGORY: 'category',
      VALUATION: 'valuation'
    }

    const shareData = {
      title: 'DENAURLEN',
      text: 'A post on DENAURLEN',
      url: `${window.location.origin}/post/${type[postType]}/${moreOptionsWithEditFor}`
    }
    navigator.share(shareData).catch(() => null)
  }, [moreOptionsWithEditFor, postType])

  const editHandler = () => dispatch(postActions.showEditOption())

  const errorCallback = () => {
    setState(cur => ({
      ...cur,
      isDeleting: false,
      showConfirmDelete: false
    }))
    toastHandler('Unable to delete post, try later')
  }

  const successCallback = () => {
    setState(cur => ({
      ...cur,
      isDeleting: false,
      showConfirmDelete: false
    }))
    toastHandler('Post is deleted')
    dispatch(postPopupActions.closePost())
    closeHandler()
  }

  const { mutate: generalPostDeleteHandler } = useDeleteGeneralPost({
    onSuccess: successCallback,
    onError: errorCallback,
    username: profile.username
  })

  const { mutate: deleteCategoryPostHandler } = useDeleteCategoryPost({
    successCallback: successCallback,
    errorCallback: errorCallback,
    username: profile.username,
    categoryId
  })

  const deleteHandler = () => {
    const deleteAction = {
      CATEGORY: (postId: string) => postServices.deleteCategoryPost(postId),
      VALUATION: (postId: string) => postServices.deleteGeneralPost(postId)
    }

    if (showConfirmDelete) {
      setState(cur => ({ ...cur, isDeleting: true }))

      if (postType === 'GENERAL') return generalPostDeleteHandler({ postId: moreOptionsWithEditFor })

      if (postType === 'CATEGORY') return deleteCategoryPostHandler({ postId: moreOptionsWithEditFor })

      deleteAction[postType](moreOptionsWithEditFor)
        .then(() => {
          sessionStorage.clear()
          queryClient.clear()
          closeHandler()
          setState(cur => ({
            ...cur,
            isDeleting: false,
            showConfirmDelete: false
          }))
          router.back()
          toastHandler('Post is deleted')
          dispatch(postPopupActions.closePost())
        })
        .catch(() => {
          setState(cur => ({
            ...cur,
            isDeleting: false,
            showConfirmDelete: false
          }))
          toastHandler('Unable to delete post, try later')
        })
    } else {
      setState(state => ({ ...state, showConfirmDelete: true }))
    }
  }

  return (
    <Popup open={!!moreOptionsWithEditFor} onClose={closeHandler}>
      <div className={newCSS.popup}>
        {showConfirmDelete ? (
          <>
            <h5 style={{ fontSize: 16, fontWeight: 500 }}>Are you sure? you want to delete the post</h5>
            <div className={newCSS.btn_grp}>
              <Button
                variant="outline"
                label="delete"
                onClick={deleteHandler}
                loading={isDeleting}
                color="danger"
              />
              <Button variant="contained" disabled={isDeleting} label="cancel" onClick={closeHandler} />
            </div>
          </>
        ) : (
          <div className={newCSS.wrapper}>
            <ButtonBase className={newCSS.share} onClick={shareHandler}>
              <ShareIcon />
              <span>share</span>
            </ButtonBase>
            <ButtonBase className={newCSS.link} onClick={onCopyLink}>
              <LinkIcon />
              <span>Link</span>
            </ButtonBase>
            {postType === 'VALUATION' ? (
              <ButtonBase className={newCSS.edit} onClick={editHandler}>
                <EditIcon2 />
                <span>Edit</span>
              </ButtonBase>
            ) : (
              <ButtonBase className={newCSS.report} onClick={deleteHandler}>
                <DeleteIcon />
                <span>Delete</span>
              </ButtonBase>
            )}
            <ButtonBase
              className={`${newCSS.mute} ${postType === 'VALUATION' && newCSS.span}`}
              onClick={closeHandler}
            >
              Cancel
            </ButtonBase>
            {postType === 'VALUATION' || (
              <ButtonBase className={newCSS.follow} onClick={editHandler}>
                Edit
              </ButtonBase>
            )}
          </div>
        )}
      </div>
    </Popup>
  )
}
