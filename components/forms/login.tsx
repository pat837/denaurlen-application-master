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
import { FormEvent, useContext, useState } from 'react';
import GoogleLogin from 'react-google-login';

import userService from '../../api-routes/user'
import constants from '../../config/constants';
import { AuthContext } from '../../contexts/auth.context';
import useFormField from '../../hooks/form-field.hook';
import css from '../../styles/login-form.module.scss';
import EyeOffIcon from '../icons/eye-off.icon';
import EyeIcon from '../icons/eye.icon';
import InvalidEmailIcon from '../icons/invalid-email.icon';
import Button from '../ui/button'
import Popup from '../ui/popup';

const LoginForm = () => {
  const [router, { setUser }] = [useRouter(), useContext(AuthContext)]

  const [state, setState] = useState({
    showPassword: false,
    isFormSubmitting: false,
    error: '',
    showNewUserPopup: false
  })

  const closeNewUserPopup = () =>
    setState({
      ...state,
      showNewUserPopup: false
    })

  const username = useFormField({})
  const password = useFormField({})

  const changeHandler = () => setState((cur) => ({ ...cur, showPassword: !cur.showPassword }))

  const responseGoogle = (res: any) => {
    try {
      const {
        tokenId,
        profileObj: { email }
      } = res

      setState({ ...state, isFormSubmitting: true })

      if (!!tokenId && !!email) {
        userService
          .isEmailExists(email)
          .then(({ data }) => {
            if (data.alreadyExists) {
              localStorage.clear()
              userService.signinWithGoogle(tokenId).then(({ data }) => {
                setUser(data.user)
                router.push(window.sessionStorage.getItem(constants.initRoute) ?? '/profile')
              })
            } else {
              setState({ ...state, isFormSubmitting: false, showNewUserPopup: true })
            }
          })
          .catch(({ response }) =>
            setState({
              ...state,
              isFormSubmitting: false,
              error: response?.data?.message || 'Something went wrong'
            })
          )
      }
    } catch (error) {
      if (state.isFormSubmitting)
        setState({
          ...state,
          isFormSubmitting: false,
          error: 'Something went wrong'
        })
    }
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let errorCount = 0

    if (!username.value) {
      errorCount++
      username.setError({ error: true, helperText: 'Please enter your email address' })
    }
    if (!password.value) {
      errorCount++
      password.setError({ error: true, helperText: 'Please enter your password' })
    }

    if (errorCount !== 0) return
    setState(cur => ({ ...cur, isFormSubmitting: true }))
    localStorage.clear()
    userService
      .login({ username: username.value.trim(), password: password.value.trim() })
      .then(({ data }) => {
        setUser(data.user)
        router.push(sessionStorage.getItem(constants.initRoute) ?? '/profile')
      })
      .catch(({ response }) => {
        setState({
          ...state,
          isFormSubmitting: false,
          error: response?.data?.message || 'Something went wrong.'
        })
      })
  }

  return (
    <div className={css.wrapper}>
      <div className={css.title}>
        <h2>SIGN IN</h2>
        <p>Connect &amp; Collect..!</p>
      </div>
      <form autoComplete="off" onSubmit={submitHandler}>
        {!!state.error && <div className={css.error_info_card}>{state.error}</div>}
        <InputField label="Username or Email" {...username.params} />
        <div className={css.password_container}>
          <FormControl variant="outlined">
            <InputLabel error={password.params.error}>Password</InputLabel>
            <OutlinedInput
              type={state.showPassword ? 'text' : 'password'}
              label="Password"
              value={password.value}
              error={password.params.error}
              onChange={password.params.onChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={changeHandler}
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
          <Link href="/forgot-password">Forgot Password?</Link>
        </div>
        <Button label="Login" square loading={state.isFormSubmitting} type="submit" />
        <p>
          New to DENAURLEN? &nbsp;<Link href="/signup">Sign Up</Link>
        </p>
      </form>
      <div className={css.or}>
        <span>OR</span>
      </div>
      <GoogleLogin
        className={css.signin_with_google}
        clientId={constants.GOOGLE_CLIENT_ID}
        buttonText="Continue with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
      <Popup open={state.showNewUserPopup} onClose={closeNewUserPopup}>
        <div style={{ display: 'grid', placeItems: 'center' }}>
        <div className={css['new-user-popup']}>
          <InvalidEmailIcon />
          <h3>This is not a verified email address, please try using an another email.</h3>
          <Button label="Sign Up" square onClick={() => router.push('/signup')} />
        </div>
        </div>
      </Popup>
    </div>
  )
}

export default LoginForm
