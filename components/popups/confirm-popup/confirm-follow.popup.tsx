import { useRouter } from 'next/router'
import { useLayoutEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import profileService from '../../../api-routes/Profile'
import useIsFollowing from '../../../api-routes/profile-queries/follow-following/is-following'
import { systemOptionsActions } from '../../../data/actions'
import usePopup from '../../../hooks/popup.hook'
import UserIcon from '../../icons/user.icon'
import Button from '../../ui/button'
import Checkbox from '../../ui/checkbox'
import Popup from '../../ui/popup'
import css from './interesting-popup.module.scss'

const ConfirmFollowPopup = () => {
  const { closePopup, isOpen } = usePopup()
  const router = useRouter()
  const [check, setCheck] = useState(false)
  const [state, setState] = useState<{
    label: string
    variant: 'filled' | 'outline'
    isLoading: boolean
  }>({
    label: 'Follow',
    variant: 'filled',
    isLoading: false
  })

  const dispatch = useDispatch()
  const closeHandler = () => {
    closePopup()
    if (check) dispatch(systemOptionsActions.confirmPopups.follow.toggle())
  }

  const checkHandler = () => setCheck(!check)

  const { data, refetch, isLoading } = useIsFollowing(router.query?.user?.toString() || '')

  const clickHandler = () => {
    setState(state => ({ ...state, isLoading: true }))
    profileService
      .follow(router.query?.user?.toString() || '')
      .then(() => {
        refetch()
          .then(() => {
            setState(state => ({ ...state, isLoading: false }))
            closePopup()
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
        variant: data ? 'outline' : 'filled',
        isLoading: false
      }))
  }, [data])

  return (
    <Popup open={isOpen('before-follow')} onClose={closeHandler}>
      <div className={css.wrapper}>
        <div className={`${css.container} ${css.follow}`}>
          <UserIcon />
          <p>By Following the profile 500 coins will be transferred form your wallet to following profile</p>
          <Checkbox checked={check} label="Don't show this again" onChange={checkHandler} />
          <span />
          <Button {...state} loading={isLoading || state.isLoading} onClick={clickHandler} />
        </div>
      </div>
    </Popup>
  )
}

export default ConfirmFollowPopup
