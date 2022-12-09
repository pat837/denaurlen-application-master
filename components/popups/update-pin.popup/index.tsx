import { IconButton } from '@mui/material'
import { FormEventHandler, useRef, useState } from 'react'
import useUpdatePin from '../../../api-routes/transactions/update-pin'

import usePopup from '../../../hooks/popup.hook'
import useToastMessage from '../../../hooks/toast-message.hook'
import EyeOffIcon from '../../icons/eye-off.icon'
import EyeIcon from '../../icons/eye.icon'
import Button from '../../ui/button'
import Popup from '../../ui/popup'
import css from './update-pin.popup.module.scss'

const UpdatePinPopup = () => {
  const { isOpen, closePopup } = usePopup()
  const formRef = useRef<HTMLFormElement | null>(null)
  const [{ showNewPassword, showOldPassword }, setState] = useState({
    showOldPassword: false,
    showNewPassword: false
  })
  const showToast = useToastMessage()
  const { mutate, isLoading } = useUpdatePin()

  const togglePassword = (type: 'old' | 'new') => () => {
    setState(state => ({
      ...state,
      showNewPassword: type === 'new' ? !state.showNewPassword : state.showNewPassword,
      showOldPassword: type === 'old' ? !state.showOldPassword : state.showOldPassword
    }))
  }

  const submitHandler: FormEventHandler = event => {
    event.preventDefault()

    if (!formRef?.current || isLoading) return undefined

    const [oldPin, newPin, confirmPin] = [
      formRef.current['old-pin'],
      formRef.current['new-pin'],
      formRef.current['confirm-pin']
    ] as HTMLInputElement[]

    if (!oldPin.value || !newPin.value || !confirmPin.value) {
      return showToast('Fill all fields')
    }
    if (
      isNaN(oldPin.value as unknown as number) ||
      isNaN(newPin.value as unknown as number) ||
      isNaN(confirmPin.value as unknown as number)
    )
      return showToast('Enter only numbers')

    if (newPin.value !== confirmPin.value) {
      return showToast("Confirm password didn't match")
    }

    mutate(
      { newPin: newPin.value, oldPin: oldPin.value },
      {
        onError: (error: any, variables, context) => {
          showToast(error?.response?.data?.message ?? 'Something went wrong')
        },
        onSuccess: (data: any, variables, context) => {
          showToast(data?.data?.message ?? 'Your U-Card pin as been updated')
        }
      }
    )
  }

  return (
    <Popup open={isOpen('update-pin')} onClose={closePopup}>
      <div className={css.popup}>
        <h4>Update U-Card Pin</h4>
        <form ref={formRef} onSubmit={submitHandler}>
          <div className={css.input_field}>
            <input
              type={showOldPassword ? 'text' : 'password'}
              inputMode="numeric"
              name="old-pin"
              placeholder="Current U-Card Pin"
            />
            <IconButton tabIndex={2} aria-label="show-pin-toggler" onClick={togglePassword('old')}>
              {showOldPassword ? <EyeOffIcon /> : <EyeIcon />}
            </IconButton>
          </div>
          <div className={css.input_field}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              inputMode="numeric"
              name="new-pin"
              maxLength={4}
              placeholder="New U-Card Pin"
            />
            <IconButton tabIndex={2} aria-label="show-pin-toggler" onClick={togglePassword('new')}>
              {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
            </IconButton>
          </div>
          <div className={css.input_field}>
            <input type="password" inputMode="numeric" name="confirm-pin" placeholder="Confirm new Pin" />
          </div>
          <div className={css.button_group}>
            <Button label="cancel" variant="contained" />
            <Button label="update" type="submit" loading={isLoading} />
          </div>
        </form>
      </div>
    </Popup>
  )
}

export default UpdatePinPopup
