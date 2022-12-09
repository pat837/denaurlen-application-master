import { useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import profileService, { useGetFollowFollowingCounts } from '../../api-routes/Profile'
import useIsFollowing from '../../api-routes/profile-queries/follow-following/is-following'
import { systemOptionsActions } from '../../data/actions'
import usePopup from '../../hooks/popup.hook'
import { storeType } from '../../types'
import Button from './button'

export const FollowButton = ({
  userId,
  username,
  square = false
}: {
  userId: string
  username: string
  square?: boolean
}) => {
  const [state, setState] = useState<{
    label: string
    variant: 'filled' | 'outline'
    isLoading: boolean
  }>({
    label: 'Follow',
    variant: 'filled',
    isLoading: false
  })

  const { refetch: refetchCount } = useGetFollowFollowingCounts(username)
  const { data, refetch, isLoading } = useIsFollowing(userId)
  const dispatch = useDispatch()
  const { openPopup } = usePopup()
  const {
    confirmPopups: { follow }
  } = useSelector((s: storeType) => s.systemOptions)

  const clickHandler = () => {
    if (data) return openPopup('confirm-unfollow', { params: { user: userId } })

    dispatch(systemOptionsActions.confirmPopups.follow.incrementClicks())

    if (follow.show) return openPopup('before-follow', { params: { user: userId } })

    setState(state => ({ ...state, isLoading: true }))
    profileService
      .follow(userId)
      .then(() => {
        refetch()
          .then(() => setState(state => ({ ...state, isLoading: false })))
          .catch(() => setState(state => ({ ...state, isLoading: false })))
        refetchCount()
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
    <Button {...state} loading={isLoading || state.isLoading} square={square} onClick={clickHandler} />
  )
}
