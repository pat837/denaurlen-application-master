import { IconButton } from '@mui/material'
import moment from 'moment'
import { FormEventHandler, useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useRequestResetPin from '../../../api-routes/transactions/request-reset-pin'
import useResetPin from '../../../api-routes/transactions/reset-pin'
import { coinWalletActions } from '../../../data/actions'
import usePopup from '../../../hooks/popup.hook'
import useToastMessage from '../../../hooks/toast-message.hook'
import { storeType } from '../../../types'
import EyeOffIcon from '../../icons/eye-off.icon'
import EyeIcon from '../../icons/eye.icon'
import Button from '../../ui/button'
import Popup from '../../ui/popup'
import css from './reset-pin.popup.module.scss'

const ResetPinPopup = () => {
  const { isOpen, closePopup } = usePopup()
  const { mutate: requestOTP } = useRequestResetPin()
  const { mutate, isLoading } = useResetPin()
  const [showPin, setShowPin] = useState(false)
  const dispatch = useDispatch()
  const formRef = useRef<HTMLFormElement | null>(null)
  const state = useSelector((store: storeType) => store.coinWallet)
  const showToast = useToastMessage()

  const open = isOpen('reset-pin')

  const handleRequestOTP = useCallback(() => {
    requestOTP(undefined, {
      onSuccess: () => {
        dispatch(coinWalletActions.setResetPinDate(new Date()))
      }
    })
  }, [dispatch, requestOTP])

  useEffect(() => {
    if (
      open &&
      (state?.lastResetPinTime === undefined ||
        moment(moment.now()).diff(moment(state.lastResetPinTime), 's') > 3 * 60)
    )
      handleRequestOTP()
  }, [handleRequestOTP, open, state?.lastResetPinTime])

  const submitHandler: FormEventHandler = event => {
    event.preventDefault()

    if (!formRef.current) return undefined

    const [otp, pin] = [formRef?.current?.otp?.value, formRef?.current?.pin?.value]

    if (!otp || !pin) return undefined

    if (isNaN(pin as unknown as number)) return showToast('Enter only number')

    mutate(
      { otp, pin },
      {
        onSuccess: data => {
          showToast(data?.data?.message)
          closePopup()
        },
        onError: (error: any) => {
          showToast(error?.response?.data?.message)
        }
      }
    )
  }

  return (
    <Popup open={isOpen('reset-pin')} onClose={closePopup}>
      <div className={css.wrapper}>
        <h4>Reset U-Coin Pin</h4>
        <p>Confirmation code is sent to your registered email address</p>
        <form ref={formRef} onSubmit={submitHandler}>
          <div className={css.input_field}>
            <input type="text" inputMode="numeric" name="otp" placeholder="Confirmation Code" />
          </div>
          <div className={css.input_field}>
            <input
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              name="pin"
              maxLength={4}
              placeholder="New U-Card Pin"
            />
            <IconButton tabIndex={2} aria-label="show-pin-toggler" onClick={() => setShowPin(s => !s)}>
              {showPin ? <EyeOffIcon /> : <EyeIcon />}
            </IconButton>
          </div>
          <div className={css.button_group}>
            <Button label="cancel" variant="contained" />
            <Button label="update" type="submit" loading={isLoading} />
          </div>
        </form>
        <p>
          Didn&apos;t received code?{' '}
          <Button label="request code" variant="text" removePadding onClick={handleRequestOTP} />
        </p>
      </div>
    </Popup>
  )
}

export default ResetPinPopup
