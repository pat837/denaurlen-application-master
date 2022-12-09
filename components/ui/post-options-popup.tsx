import { ButtonBase } from '@mui/material'
import { useCallback, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import profileService from '../../api-routes/Profile'
import useIsFollowing from '../../api-routes/profile-queries/follow-following/is-following'
import { postActions } from '../../data/actions'
import useOpenReportPopup from '../../hooks/open-report-popup.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import css from '../../styles/components/ui/post-option-popup.module.scss'
import LinkIcon from '../icons/link.icon'
import ReportIcon from '../icons/report.icon'
import ShareIcon from '../icons/share.icon'
import Popup from './popup'

import type { storeType } from '../../types'

const PostOptionsPopup = () => {
  const [dispatch, { moreOptionsFor, postType, userId }, showToast] = [
    useDispatch(),
    useSelector((state: storeType) => state.postState),
    useToastMessage()
  ]

  const closeHandler = useCallback(() => dispatch(postActions.hideMoreOptions()), [dispatch])

  const copyLinkHandler = useCallback(() => {
    const type = {
      GENERAL: 'general',
      CATEGORY: 'category',
      VALUATION: 'valuation'
    }

    navigator.clipboard.writeText(`${window.location.origin}/post/${type[postType]}/${moreOptionsFor}`)

    showToast('Link copied to clipboard')
  }, [moreOptionsFor, postType, showToast])

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
      url: `${window.location.origin}/post/${type[postType]}/${moreOptionsFor}`
    }

    navigator.share(shareData).catch(() => null)
    closeHandler()
  }, [closeHandler, moreOptionsFor, postType])

  const reportHandler = useOpenReportPopup({ id: moreOptionsFor, type: 'post' })

  return (
    <Popup open={!!moreOptionsFor} onClose={closeHandler}>
      <div className={css.popup}>
        <div className={css.wrapper}>
          <ButtonBase className={css.share} onClick={shareHandler}>
            <ShareIcon />
            <span>Share</span>
          </ButtonBase>
          <ButtonBase className={css.link} onClick={onCopyLink}>
            <LinkIcon />
            <span>Link</span>
          </ButtonBase>
          <ButtonBase className={css.report} onClick={reportHandler}>
            <ReportIcon />
            <span>Report</span>
          </ButtonBase>
          <ButtonBase className={css.mute}>Mute</ButtonBase>
          <FollowButton onClick={closeHandler} className={css.follow} userId={userId} />
        </div>
      </div>
    </Popup>
  )
}

const FollowButton = ({
  onClick,
  className,
  userId
}: {
  onClick: () => void
  className: string
  userId: string
}) => {
  const [state, setState] = useState<{
    label: string
    isLoading: boolean
  }>({
    label: 'Follow',
    isLoading: false
  })

  const { data, refetch } = useIsFollowing(userId)

  const clickHandler = () => {
    setState(state => ({ ...state, isLoading: true }))
    profileService
      .follow(userId)
      .then(() => {
        refetch()
          .then(() => setState(state => ({ ...state, isLoading: false })))
          .catch(() => setState(state => ({ ...state, isLoading: false })))
      })
      .catch(() => {
        setState(state => ({ ...state, isLoading: false }))
      })
    onClick()
  }
  useLayoutEffect(() => {
    if (data === undefined) setState(state => ({ ...state, isLoading: true }))
    else
      setState(state => ({
        ...state,
        label: data ? 'Unfollow' : 'Follow',
        variant: data ? 'text' : 'primary',
        isLoading: false
      }))
  }, [data])

  return (
    <ButtonBase className={className} onClick={clickHandler}>
      {state.isLoading ? 'Loading...' : state.label}
    </ButtonBase>
  )
}

export default PostOptionsPopup
