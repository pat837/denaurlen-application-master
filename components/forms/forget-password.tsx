import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField as InputField,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { useStopwatch } from 'react-timer-hook';

import http from '../../config/http';
import useFormField from '../../hooks/form-field.hook';
import css from '../../styles/forgot-pwd-form.module.scss';
import EyeOffIcon from '../icons/eye-off.icon';
import EyeIcon from '../icons/eye.icon';
import SuccessIcon from '../icons/success.icon';
import Button from '../ui/button'
import Popup from '../ui/popup';

type formType = {
  form: ReactElement
  onSubmit: () => void
}

type formListType = {
  EMAIL_VERIFICATION_FORM: formType
  CREATE_PASSWORD_FORM: formType
}

type stateType = {
  form: 'EMAIL_VERIFICATION_FORM' | 'CREATE_PASSWORD_FORM'
  isOTPSend: boolean
  showPassword: boolean
  isSubmitting: boolean
  error: string
  isSuccessPopupOpen: boolean
}

const ForgotPasswordForm = () => {
  const navigate = useRouter().push

  const email = useFormField({})
  const password = useFormField({})
  const confirmPassword = useFormField({})
  const otp = useFormField({})

  const [state, setState] = useState<stateType>({
    form: 'EMAIL_VERIFICATION_FORM',
    isOTPSend: false,
    showPassword: false,
    isSubmitting: false,
    error: '',
    isSuccessPopupOpen: false
  })

  const openSuccessPopup = () => setState({ ...state, isSuccessPopupOpen: true })

  const {
    seconds: countDown,
    minutes,
    isRunning,
    pause,
    reset: startCountDown
  } = useStopwatch({ autoStart: false })

  useEffect(() => {
    if (minutes === 1) pause()
  }, [minutes, pause])

  const validatePassword = () => {
    if (password.value !== confirmPassword.value)
      confirmPassword.setError({ error: true, helperText: 'Password is not matching' })
  }

  const setLoader = () => setState((cur) => ({ ...cur, isSubmitting: true }))

  const showPasswordHandler = () =>
    setState((cur) => ({
      ...cur,
      showPassword: !cur.showPassword
    }))

  const verifyEmailAndSendOTP = () => {
    http
      .post('/auth/email/exists', {
        email: email.value
      })
      .then(({ data }) => {
        if (data.alreadyExists) {
          sendOTP()
          setState({ ...state, isOTPSend: true })
        } else {
          email.setError({ error: true, helperText: 'Invalid email address' })
          setState({ ...state, isOTPSend: false })
        }
      })
      .catch((error) => {
        alert('something went wrong')
      })
  }

  const sendOTP = () => {
    if (!email.value)
      return email.setError({ error: true, helperText: 'Please enter your email address' })
    http.post('/auth/email/reset-otp', { email: email.value }).catch(() => null)
    startCountDown()
  }

  const formList: formListType = {
    EMAIL_VERIFICATION_FORM: {
      form: (
        <>
          <div className={css.title}>
            <h2>Forgot Password?</h2>
            <p>No worries, we&apos;ve covered you!</p>
          </div>
          <div className={css.form}>
            <div className={css.info_card}>
              For password reset, please enter your registered email address to receive
              confirmation code (OTP).
            </div>
            <span />
            {!!state.error && <div className={css.error_info_card}>{state.error}</div>}
            <FormControl variant="outlined">
              <InputLabel>Email</InputLabel>
              <OutlinedInput
                type="text"
                label="Email"
                value={email.value}
                onChange={email.params.onChange}
                error={email.params.error}
                endAdornment={
                  <InputAdornment position="end">
                    {!!email.value &&
                      !email.params.error &&
                      (state.isOTPSend ? (
                        <span style={{ color: '#32CD32' }}>&#10004;</span>
                      ) : (
                        <a
                          href="!#"
                          style={{ fontWeight: 600 }}
                          onClick={(e) => {
                            e.preventDefault()
                            verifyEmailAndSendOTP()
                          }}
                        >
                          Send
                        </a>
                      ))}
                  </InputAdornment>
                }
                inputProps={{ 'aria-label': 'email' }}
              />
              <FormHelperText error={email.params.error}>{email.params.helperText}</FormHelperText>
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel>Enter confirmation code (OTP)</InputLabel>
              <OutlinedInput
                type="text"
                label="Enter confirmation code (OTP)"
                value={otp.value}
                onChange={otp.params.onChange}
                error={otp.params.error}
                endAdornment={
                  <InputAdornment position="end">
                    {isRunning && `${60 - countDown} sec`}
                  </InputAdornment>
                }
                inputProps={{ 'aria-label': 'otp' }}
              />
              <FormHelperText error={otp.params.error}>{otp.params.helperText}</FormHelperText>
            </FormControl>
            <Button
              label="Next"
              loading={state.isSubmitting}
              type="submit"
              disabled={state.isSubmitting}
            />
          </div>
        </>
      ),
      onSubmit: () => {
        let errorCount = 0

        if (!email.value) {
          errorCount++
          email.setError({ error: true, helperText: 'Please enter your email address' })
        } else if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email.value)) {
          email.setError({
            error: true,
            helperText: 'Please enter a valid email address.'
          })
          errorCount++
        }
        if (!otp.value) {
          errorCount++
          otp.setError({ error: true, helperText: 'Please enter your confirmation code (OTP)' })
        }

        if (errorCount !== 0) return

        setLoader()
        http
          .post('/auth/email/verify-otp', { otp: otp.value })
          .then(({ data }) => {
            setState((cur) => ({
              ...cur,
              form: 'CREATE_PASSWORD_FORM',
              isSubmitting: false,
              error: ''
            }))
          })
          .catch(({ response }) => {
            const message =
              !!response && !!response.data && !!response.data.message
                ? response.data.message
                : 'Something went wrong'
            setState((cur) => ({
              ...cur,
              isSubmitting: false,
              error: message
            }))
            otp.reset()
          })
      }
    },
    CREATE_PASSWORD_FORM: {
      form: (
        <>
          <div className={css.title}>
            <h2>Create New Password</h2>
            <p>Your identity has been verified! Set a new password</p>
          </div>
          <div className={css.form}>
            <div className={css.info_card}>
              Make sure to enter at least 6 digit password which includes special character(s).
            </div>
            <span />
            <FormControl variant="outlined">
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                type={state.showPassword ? 'text' : 'password'}
                label="Password"
                {...password.params}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={showPasswordHandler}
                      edge="end"
                    >
                      {state.showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText error={password.params.error}>
                {password.params.helperText}
              </FormHelperText>
            </FormControl>
            <InputField
              label="Confirm Password"
              type="password"
              {...confirmPassword.params}
              onBlur={validatePassword}
            />
            <Button
              label="Next"
              loading={state.isSubmitting}
              type="submit"
              disabled={state.isSubmitting}
            />
          </div>
        </>
      ),
      onSubmit: () => {
        let errorCount = 0

        if (!password.value) {
          errorCount++
          password.setError({
            error: true,
            helperText: 'Please enter new password'
          })
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
            password.value
          )
        ) {
          errorCount++
          password.setError({
            error: true,
            helperText:
              'Please enter a strong password'
          })
        }

        if (!confirmPassword.value) {
          errorCount++
          confirmPassword.setError({
            error: true,
            helperText: 'Please confirm your password'
          })
        }

        if (!confirmPassword.params.error && errorCount === 0) {
          setLoader()
          http
            .post('/auth/reset-password', {
              email: email.value,
              password: password.value
            })
            .then(openSuccessPopup)
            .catch((e) => {
              setState((c) => ({
                ...c,
                isSubmitting: false
              }))
            })
        }
      }
    }
  }

  return (
    <div className={css.wrapper}>
      <form
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault()
          formList[state.form].onSubmit()
        }}
      >
        {formList[state.form].form}
        {state.form === 'EMAIL_VERIFICATION_FORM' && (
          <p className={css.login_link}>
            Didn&apos;t receive the code? &nbsp;
            {isRunning || !email.value ? (
              <b>Resend</b>
            ) : (
              <a
                href="!#"
                onClick={(e) => {
                  e.preventDefault()
                  sendOTP()
                }}
              >
                Resend
              </a>
            )}
          </p>
        )}
      </form>
      <Popup open={state.isSuccessPopupOpen} onClose={() => navigate('/login')}>
        <div className={css['success-popup']}>
          <SuccessIcon />
          <p>Your password has been updated successfully.</p>
          <Link href="/login">Back to Login</Link>
        </div>
      </Popup>
    </div>
  )
}

export default ForgotPasswordForm
