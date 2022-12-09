import css from './toast-message.module.scss'

import { useDispatch, useSelector } from 'react-redux'
import { Snackbar } from '@mui/material'
import { storeType } from '../../../types'
import { toastActions } from '../../../data/actions'

const ToastMessage = () => {
  const [dispatch, { message, duration, show }] = [
    useDispatch(),
    useSelector((state: storeType) => state.toastState)
  ]

  const handleClose = () => {
    dispatch(toastActions.removeToast())
  }

  return (
    <Snackbar
      classes={{ anchorOriginBottomCenter: `${css.wrapper} ${css.wrapper}` }}
      message={message}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      open={show}
    />
  )
}

export { ToastMessage }
