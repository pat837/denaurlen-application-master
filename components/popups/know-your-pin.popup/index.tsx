import { IconButton } from '@mui/material'
import { FormEvent, useRef, useState } from 'react'

import useKnowYourPin from '../../../api-routes/transactions/know-your-pin'
import usePopup from '../../../hooks/popup.hook'
import useToastMessage from '../../../hooks/toast-message.hook'
import EyeOffIcon from '../../icons/eye-off.icon'
import EyeIcon from '../../icons/eye.icon'
import Button from '../../ui/button'
import Popup from '../../ui/popup'
import css from './know-your-pin.module.scss'

const KnowYourPin = () => {
  const { isOpen, closePopup } = usePopup()

  return (
    <Popup open={isOpen('know-your-pin')} onClose={closePopup}>
      <div className={css.wrapper}>
        <h4>Know your pin</h4>
        <p>Enter your password(used for login) to get your U-Card pin to your registered email address</p>
        <KnowYourPinForm />
      </div>
    </Popup>
  )
}

const KnowYourPinForm = () => {
  const { closePopup } = usePopup()
  const formRef = useRef<HTMLFormElement | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { mutate, isLoading } = useKnowYourPin()
  const showToast = useToastMessage()

  const submitHandler = (event: FormEvent) => {
    event.preventDefault()
    const passwordField = formRef?.current?.password as HTMLInputElement | undefined

    if (!passwordField?.value) {
      passwordField?.focus()
      showToast('Enter your password')
      return undefined
    }

    mutate(
      { password: passwordField.value },
      {
        onError: (error: any, _variables, _context) => {
          showToast(error?.response?.data?.message || 'Something went wrong')
        },
        onSuccess(data, _variables, _context) {
          showToast(data?.data?.message || 'Your U-Card pin send to your email')
          formRef.current?.reset()
          closePopup()
        }
      }
    )
  }
  return (
    <form ref={formRef} onSubmit={submitHandler} className={css.form_group}>
      <div className={css.input_field}>
        <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" />
        <IconButton aria-label="show-password-toggle" onClick={() => setShowPassword(cur => !cur)}>
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </IconButton>
      </div>
      <Button label="close" variant="contained" onClick={closePopup} />
      <Button label="get mail" type="submit" loading={isLoading} />
    </form>
  )
}

export default KnowYourPin
