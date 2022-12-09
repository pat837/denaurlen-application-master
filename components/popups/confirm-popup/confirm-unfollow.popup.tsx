import { useRouter } from 'next/router'
import { useLayoutEffect, useState } from 'react'

import profileService from '../../../api-routes/Profile'
import useIsFollowing from '../../../api-routes/profile-queries/follow-following/is-following'
import usePopup from '../../../hooks/popup.hook'
import UserIcon from '../../icons/user.icon'
import Button from '../../ui/button'
import Popup from '../../ui/popup'
import css from './interesting-popup.module.scss'

const ConfirmUnFollowPopup = () => {
  const { closePopup: closeHandler, isOpen } = usePopup()
  const router = useRouter()
  const [state, setState] = useState<{
    label: string
    variant: 'outline'
    isLoading: boolean
  }>({
    label: 'Follow',
    variant: 'outline',
    isLoading: false
  })

  const { data, refetch, isLoading } = useIsFollowing(router.query?.user?.toString() || '')

  const clickHandler = () => {
    setState(state => ({ ...state, isLoading: true }))
    profileService
      .follow(router.query?.user?.toString() || '')
      .then(() => {
        refetch()
          .then(() => {
            setState(state => ({ ...state, isLoading: false }))
            closeHandler()
          })
          .catch(() => setState(state => ({ ...state, isLoading: false })))
      })
      .catch(() => setState(state => ({ ...state, isLoading: false })))
  }
  useLayoutEffect(() => {
    if (data === undefined) setState(state => ({ ...state, isLoading: true }))
    else
      setState(state => ({
        ...state,
        label: data ? 'unfollow' : 'follow',
        isLoading: false
      }))
  }, [data])

  return (
    <Popup open={isOpen('confirm-unfollow')} onClose={closeHandler}>
      <div className={css.wrapper}>
        <div className={`${css.container} ${css.follow}`}>
          <UserIcon />
          <p>If you want follow the profile then you need to spend coins again</p>
          <div className={css.btn_group}>
            <Button {...state} loading={isLoading || state.isLoading} onClick={clickHandler} />
            <Button label="cancel" variant="contained" onClick={closeHandler} />
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default ConfirmUnFollowPopup
