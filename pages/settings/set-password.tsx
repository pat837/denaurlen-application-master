import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import { useRouter } from 'next/router'
import { FormEvent, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'

import useSetPassword from '../../api-routes/settings/set-password'
import EyeOffIcon from '../../components/icons/eye-off.icon'
import EyeIcon from '../../components/icons/eye.icon'
import Button from '../../components/ui/button'
import { queryClient } from '../../config/query-client'
import storage from '../../config/storage'
import { AuthContext } from '../../contexts/auth.context'
import { ThemeContext } from '../../contexts/theme.context'
import { toastActions } from '../../data/actions'
import useFormField from '../../hooks/form-field.hook'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/settings/change-password.module.scss'
import { sleep } from '../../utils'

const SetPasswordPage = () => {
  usePageTitle({ title: 'Create Password' })

  const [{ showNewPassword, showCurrentPassword }, setState] = useState({
    showCurrentPassword: false,
    showNewPassword: false
  })

  const [currentPassword, newPassword, dispatch, router, { removeUser }, { setTheme }] = [
    useFormField({}),
    useFormField({}),
    useDispatch(),
    useRouter(),
    useContext(AuthContext),
    useContext(ThemeContext)
  ]

  const toggleCurrentPassword = () => {
    setState(state => ({ ...state, showCurrentPassword: !state.showCurrentPassword }))
  }

  const toggleNewPassword = () => {
    setState(state => ({ ...state, showNewPassword: !state.showNewPassword }))
  }

  const { mutate: setPassword, isLoading: isSubmitting } = useSetPassword({
    onError: error => {
      dispatch(toastActions.showToast(error?.response?.data?.message || 'Unable to change password, try later'))
    },
    onSuccess: res => {
      queryClient.clear()
      removeUser()
      router.push('/login')
      sleep(1000, () => {
        storage.session.clear()
        storage.local.clear()
      })
      setTheme('LIGHT')
    }
  })

  const clearHandler = () => {
    currentPassword.reset()
    newPassword.reset()
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    let errorCount = 0

    if (!newPassword.value) {
      errorCount++
      newPassword.setError({
        error: true,
        helperText: 'Please enter new password'
      })
    } else if (newPassword.value.length < 6) {
      errorCount++
      newPassword.setError({
        error: true,
        helperText: 'Password should contain at least 6 characters'
      })
    }

    if (!currentPassword.value) {
      errorCount++
      currentPassword.setError({
        error: true,
        helperText: 'Please confirm password'
      })
    } else if (currentPassword.value !== newPassword.value) {
      errorCount++
      currentPassword.setError({
        error: true,
        helperText: 'Password did not matched'
      })
    }

    if (!currentPassword.params.error && errorCount === 0) {
      setPassword({ newPassword: newPassword.value })
    }
  }

  return (
    <div className={css.page}>
      <div className={css.wrapper}>
        <h3>Set Password</h3>
        <p className={css.sub_headline}>By setting password you will logout form all device(s)</p>
        <p className={css.info_card}>
          Make sure to enter at least 6 digit password which includes uppercase, lowercase, number and special
          character(s)
        </p>

        <form method="post" autoComplete="off" onSubmit={onSubmit}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>New Password</InputLabel>
            <OutlinedInput
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              {...newPassword.params}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle-password-visibility" onClick={toggleNewPassword} edge="end">
                    {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText error={newPassword.params.error}>{newPassword.params.helperText}</FormHelperText>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              type={showCurrentPassword ? 'text' : 'password'}
              label="New Password"
              {...currentPassword.params}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle-password-visibility" onClick={toggleCurrentPassword} edge="end">
                    {showCurrentPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText error={currentPassword.params.error}>
              {currentPassword.params.helperText}
            </FormHelperText>
          </FormControl>
          <div className={css.btn_wrapper}>
            <Button label="clear" variant="contained" type="reset" onClick={clearHandler} />
            <Button label="set password" type="submit" loading={isSubmitting} />
          </div>
        </form>
      </div>
    </div>
  )
}

SetPasswordPage.Layout = HomeLayout

export default SetPasswordPage
