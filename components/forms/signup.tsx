import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdopter from '@mui/lab/AdapterMoment';
import {
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField as InputField,
  useMediaQuery,
} from '@mui/material';
import moment from 'moment';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import { ReactElement, useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import GoogleLogin from 'react-google-login';
import { useStopwatch } from 'react-timer-hook';

import { useGetBalance } from '../../api-routes/Profile'
import userService from '../../api-routes/user'
import constants from '../../config/constants';
import { AuthContext } from '../../contexts/auth.context'
import useFormField from '../../hooks/form-field.hook'
import dialogCSS from '../../styles/congratulations-dialog.module.scss'
import css from '../../styles/signup-form.module.scss'
import { userType } from '../../types'
import { numberFormat } from '../../utils'
import EyeOffIcon from '../icons/eye-off.icon'
import EyeIcon from '../icons/eye.icon'
import LargeCoinsIcon from '../icons/large-coins.icon'
import XIcon from '../icons/x.icon'
import Button from '../ui/button'
import DialogBox from '../ui/dialog-box';
import Popup from '../ui/popup';
import RadioButton from '../ui/radio-button';

type formType = {
  form: ReactElement
  onSubmit: () => void
}

type formListType = {
  SIGNUP: formType
  CREATE_PASSWORD: formType
  TELL_ABOUT_U: formType
}

type stateType = {
  form: 'SIGNUP' | 'CREATE_PASSWORD' | 'TELL_ABOUT_U'
  showPassword: boolean
  acceptedTerms: boolean
  isSubmitting: boolean
  inputValues: {
    dob: string
    gender: string
  }
  error: string
  referredCode: string
  isOTPSend: number
}

const SignupForm = () => {
  const [navigate, { setUser }] = [useRouter(), useContext(AuthContext)]

  const isScreenBelow730 = useMediaQuery('(max-width: 724px)')

  const [openOTP, setOpenOTP] = useState(false)

  const fullName = useFormField({})
  const email = useFormField({})
  const username = useFormField({
    regex: /^[A-Za-z][A-Za-z0-9._]{3,20}$/,
    name: 'Username',
    onlyLowercase: true,
    length: 20
  })
  const password = useFormField({})
  const confirmPassword = useFormField({})
  const otp = useFormField({})

  const [place, setPlace] = useState('')
  const [location, setLocation] = useState<number[]>([])
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const placeRef = useRef<null | HTMLInputElement>(null)

  const [state, setState] = useState<stateType>({
    form: 'SIGNUP',
    showPassword: false,
    acceptedTerms: false,
    isSubmitting: false,
    inputValues: {
      dob: '',
      gender: ''
    },
    error: '',
    referredCode: window.sessionStorage.getItem(constants.REFERRAL_CODE) || '',
    isOTPSend: 0
  })

  useEffect(() => {
    if (typeof google !== 'undefined') {
      const initializer = () => {
        if (!!placeRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(placeRef?.current, {
            types: ['geocode']
          })

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            const [latitude, longitude] = [place.geometry?.location?.lat(), place.geometry?.location?.lng()]

            if (!latitude || !longitude || !place.formatted_address || !place.address_components) return null

            place.address_components.forEach(address => {
              if (address.types.includes('country')) {
                setCountryCode(address.short_name)
                setCountry(address.long_name)
              }
            })
            setLocation([longitude, latitude])
            setCity(place.formatted_address)
          })
        }
      }
      initializer()
    }
  }, [place])

  const [dialogOpen, setDialogOpen] = useState(false)

  const [newUser, setNewUser] = useState<userType | null>(null)

  const [isSignInWithGoogle, setIsSignInWithGoogle] = useState('')

  const { data } = useGetBalance(newUser?.username || '')

  const openDialog = () => setDialogOpen(true)
  const closeDialog = () => setDialogOpen(false)

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

  const radioHandler = (e: { target: { value: string } }) =>
    setState(cur => ({
      ...cur,
      inputValues: {
        ...cur.inputValues,
        gender: e.target.value
      }
    }))

  const checkUsername = () => {
    userService
      .usernameExists(username.value)
      .then(({ data }) => {
        if (data.alreadyExists === true) {
          setState({ ...state, error: 'Username is already taken' })
          username.setError({ error: true, helperText: 'Username is already taken' })
        }
      })
      .catch(() => null)
  }

  const validatePassword = () => {
    if (password.value === confirmPassword.value) return
    confirmPassword.setError({ error: true, helperText: 'Password is not matching' })
  }

  const responseGoogle = (response: any) => {
    try {
      const {
        tokenId,
        profileObj: { email, name }
      } = response

      fullName.params.onChange({ target: { value: name } })

      setState({ ...state, isSubmitting: true })

      if (!!tokenId && !!email) {
        userService
          .isEmailExists(email)
          .then(({ data }) => {
            if (data.alreadyExists) {
              localStorage.clear()
              userService.signinWithGoogle(tokenId).then(({ data }) => {
                setUser(data.user)
                navigate.push('/profile')
              })
            } else {
              setState({
                ...state,
                isSubmitting: false,
                form: 'TELL_ABOUT_U'
              })
              setIsSignInWithGoogle(tokenId)
            }
          })
          .catch(({ response }) =>
            setState({
              ...state,
              error: response.data.message || 'Something went wrong'
            })
          )
      }
    } catch (error) {
      if (state.isSubmitting) setState({ ...state, isSubmitting: false })
    }
  }

  const setLoader = () => setState(cur => ({ ...cur, isSubmitting: true }))

  const showPasswordHandler = () =>
    setState(cur => ({
      ...cur,
      showPassword: !cur.showPassword
    }))

  const dobChangeHandle = (newValue: any) =>
    setState(cur => ({
      ...cur,
      inputValues: {
        ...cur.inputValues,
        dob: newValue
      }
    }))

  const sendOTP = () => {
    setState(cur => ({ ...cur, error: '' }))
    setOpenOTP(true)
    setState({ ...state, isOTPSend: state.isOTPSend + 1 })
    userService.sendSignupOTP(email.value).catch(() => {
      pause()
      otp.setError({ error: true, helperText: 'Error while sending confirmation code (OTP)' })
    })
    startCountDown()
  }

  const verifyEmailAndSendOTP = () => {
    let errorCount = 0

    if (!email.value) {
      email.setError({ error: true, helperText: 'Please enter your email address' })
      errorCount++
    } else if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email.value)) {
      email.setError({
        error: true,
        helperText: 'Please enter a valid email address'
      })
      errorCount++
    }

    if (errorCount === 0) {
      setState(state => ({ ...state, isSubmitting: true }))
      userService.isEmailExists(email.value).then(({ data }) => {
        if (data.alreadyExists) {
          email.setError({ error: true, helperText: 'Email already exists' })
        } else {
          sendOTP()
        }
        setState(state => ({ ...state, isSubmitting: false }))
      })
    }
  }

  const formList: formListType = {
    SIGNUP: {
      form: (
        <>
          <div className={css.title}>
            <h2 data-title>SIGN UP</h2>
            <p>Connect & Collect..!</p>
          </div>
          <div className={css.form}>
            {!!state.error && <div className={css.error_info_card}>{state.error}</div>}
            <InputField variant="outlined" label="Email" {...email.params} />
            <Button label="Next" loading={state.isSubmitting} type="submit" disabled={state.isSubmitting} square />
          </div>
        </>
      ),
      onSubmit: verifyEmailAndSendOTP
    },
    TELL_ABOUT_U: {
      form: (
        <>
          <div className={css.title}>
            <h2>Woah! Verified Successfully..!</h2>
            <p>Fill the below details to continue</p>
          </div>
          <div className={css.form}>
            {!!state.error && <div className={css.error_info_card}>{state.error}</div>}
            {!isSignInWithGoogle && (
              <InputField label="Full Name" value={fullName.params.value} onChange={fullName.params.onChange} />
            )}
            <InputField
              label="Username"
              value={username.params.value}
              onChange={username.params.onChange}
              onBlur={checkUsername}
            />
            <InputField label="Location" inputRef={placeRef} type="text" onChange={e => setPlace(e.target.value)} />
            <div className={css.gender_wrapper}>
              <RadioButton label="Male" name="gender" value="MALE" onChange={radioHandler} />
              <RadioButton label="Female" name="gender" value="FEMALE" onChange={radioHandler} />
              <RadioButton label="Others" name="gender" value="OTHERS" onChange={radioHandler} />
            </div>
            <LocalizationProvider dateAdapter={DateAdopter}>
              <DatePicker
                maxDate={moment().subtract(13, 'y')}
                minDate={moment().subtract(80, 'y')}
                showDaysOutsideCurrentMonth
                openTo="year"
                allowSameDateSelection
                inputFormat="DD/MM/YYYY"
                label="Date of Birth"
                value={state.inputValues.dob}
                onChange={dobChangeHandle}
                views={['year', 'month', 'day']}
                renderInput={params => <InputField {...params} error={false} />}
              />
            </LocalizationProvider>
            <div className={css.terms}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.acceptedTerms}
                    onClick={() => setState(c => ({ ...c, acceptedTerms: !c.acceptedTerms }))}
                  />
                }
                label="I agree to the"
              />
              &nbsp;
              <Link href="https://denaurlen.in/legal/terms-conditions" passHref>
                <a target="_blank">Terms &amp; Conditions</a>
              </Link>
            </div>
            <Button label="Next" loading={state.isSubmitting} type="submit" disabled={state.isSubmitting} square />
          </div>
        </>
      ),
      onSubmit: () => {
        let errorCount = 0

        if (!state.acceptedTerms) {
          errorCount++
          setState({ ...state, error: 'Please accept the terms and conditions' })
        }

        if (!state.inputValues.dob) {
          errorCount++
          setState({ ...state, error: 'Please select your date of birth' })
        } else {
          const age = moment().diff(state.inputValues.dob, 'y')
          if (age < 13) {
            errorCount++
            setState({ ...state, error: 'Age has a limitation of minimum 13 years' })
          }
        }

        if (!state.inputValues.gender) {
          errorCount++
          setState({ ...state, error: 'Please select your gender' })
        }

        if (location.length !== 2) {
          errorCount++
          setState({ ...state, error: 'Please enter your location' })
        }

        username.setValue(username.params.value.trim())

        if (!username.value) {
          setState({ ...state, error: 'Please enter your username' })
          errorCount++
        } else if (username.params.error) {
          setState({ ...state, error: username.params.helperText })
          errorCount++
        }

        if (!isSignInWithGoogle) {
          if (!fullName.value) {
            setState({ ...state, error: 'Please enter your name' })
            fullName.setError({ error: true, helperText: 'Please enter your full name' })
            errorCount++
          } else if (!/^[a-zA-Z ]*$/.test(fullName.value)) {
            setState({ ...state, error: 'Full name should contain only alphabets and space' })
            errorCount++
          } else if (fullName.value.length < 2) {
            setState({ ...state, error: 'Full name should be at least 2 characters' })
            errorCount++
          } else if (fullName.value.length > 30) {
            setState({ ...state, error: 'Full name should not be more than 30 characters' })
            errorCount++
          }
        }

        if (errorCount !== 0) return

        if (!!isSignInWithGoogle) {
          setLoader()
          userService
            .signupWithGoogle({
              tokenId: isSignInWithGoogle,
              username: username.value.trim(),
              gender: state.inputValues.gender,
              dateOfBirth: state.inputValues.dob,
              location: location,
              password: password.value.trim(),
              email: email.value.trim(),
              name: fullName.value.trim(),
              place: city,
              country: country,
              countryCode: countryCode,
              referredCode: state.referredCode || window.sessionStorage.getItem(constants.REFERRAL_CODE) || ''
            })
            .then(({ data }) => {
              setNewUser(data.user)
              openDialog()
            })
            .catch(({ response }) => {
              const message =
                !!response && !!response.data && !!response.data.message
                  ? response.data.message
                  : 'Something went wrong'
              setState({ ...state, isSubmitting: false, error: message })
            })
        } else {
          setState(cur => ({
            ...cur,
            form: 'CREATE_PASSWORD',
            error: ''
          }))
        }
      }
    },
    CREATE_PASSWORD: {
      form: (
        <>
          <div className={css.title}>
            <h2>Create New Password</h2>
            <p>Your identity has been verified! Set a new password</p>
          </div>
          <div className={css.form}>
            <div className={css.info_card}>
              Make sure to enter at least 6 digit password which includes uppercase, lowercase, number and special
              character(s)
            </div>
            <span />
            {!!state.error && <div className={css.error_info_card}>{state.error}</div>}
            <FormControl variant="outlined">
              <InputLabel error={password.params.error}>Password</InputLabel>
              <OutlinedInput
                type={state.showPassword ? 'text' : 'password'}
                label="Password"
                {...password.params}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={showPasswordHandler} edge="end">
                      {state.showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText error={password.params.error}>{password.params.helperText}</FormHelperText>
            </FormControl>
            <InputField
              label="Confirm Password"
              type="password"
              {...confirmPassword.params}
              onBlur={validatePassword}
            />
            <Button label="Next" loading={state.isSubmitting} type="submit" disabled={state.isSubmitting} square />
          </div>
        </>
      ),
      onSubmit: () => {
        let errorCount = 0

        if (!password.value) {
          errorCount++
          password.setError({ error: true, helperText: 'Please enter a password' })
        } else if (password.value.length < 6) {
          errorCount++
          password.setError({
            error: true,
            helperText: 'Password should contain at least 6 characters'
          })
        }
        if (!confirmPassword.value) {
          errorCount++
          confirmPassword.setError({
            error: true,
            helperText: 'Please re-enter your password'
          })
        } else if (password.value !== confirmPassword.value) {
          errorCount++
          confirmPassword.setError({
            error: true,
            helperText: 'Passwords do not match'
          })
        }

        if (errorCount === 0) {
          setLoader()
          userService
            .signup({
              username: username.value.trim(),
              password: password.value.trim(),
              email: email.value.trim(),
              name: fullName.value.trim(),
              gender: state.inputValues.gender,
              dateOfBirth: state.inputValues.dob,
              location: location,
              place: city,
              country: country,
              referredCode: state.referredCode || window.sessionStorage.getItem(constants.REFERRAL_CODE) || '',
              countryCode
            })
            .then(({ data }) => {
              setNewUser(data.user)
              openDialog()
            })
            .catch(({ response }) => {
              const message =
                !!response && !!response.data && !!response.data.message
                  ? response.data.message
                  : 'Something went wrong'
              setState(c => ({
                ...c,
                isSubmitting: false,
                error: message
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
        onSubmit={event => {
          event.preventDefault()
          formList[state.form].onSubmit()
        }}
      >
        {formList[state.form].form}
        <p className={css.login_link}>
          Already a User? &nbsp;<Link href="/login">Sign In</Link>
        </p>
      </form>
      {state.form === 'SIGNUP' && (
        <>
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
        </>
      )}
      {isScreenBelow730 ? (
        <Drawer
          variant="temporary"
          anchor="bottom"
          open={dialogOpen}
          onClose={() => {
            closeDialog()
            if (!!newUser) {
              setUser(newUser)
              router.replace('/set-categories')
            }
          }}
          classes={{ paper: dialogCSS['drawer-wrapper'] }}
        >
          <div className={dialogCSS.drawer}>
            <div className={dialogCSS.dialog}>
              <LargeCoinsIcon />
              <h4>Congratulations!!</h4>
              <p>
                {numberFormat(data?.balance || 0)} U-coins have been credited to your U-coin wallet as a joining
                reward!
              </p>
              <Button
                label="Collect"
                square
                onClick={() => {
                  closeDialog()
                  if (!!newUser) {
                    setUser(newUser)
                    router.replace('/set-categories')
                  }
                }}
              />
            </div>
          </div>
        </Drawer>
      ) : (
        <DialogBox
          isOpen={dialogOpen}
          onClose={() => {
            closeDialog()
            if (!!newUser) {
              setUser(newUser)
              router.replace('/set-categories')
            }
          }}
        >
          <div className={dialogCSS.dialog}>
            <LargeCoinsIcon />
            <h4>Congratulations!!</h4>
            <p>
              {numberFormat(data?.balance || 0)} U-coins have been credited to your U-coin wallet as a joining
              reward!
            </p>
            <Button
              label="Collect"
              square
              onClick={() => {
                closeDialog()
                if (!!newUser) {
                  setUser(newUser)
                  router.replace('/set-categories')
                }
              }}
            />
          </div>
        </DialogBox>
      )}
      <Popup onClose={() => null} open={openOTP}>
        <form
          onSubmit={e => {
            e.preventDefault()

            let errorCount = 0
            if (!email.value) {
              email.setError({ error: true, helperText: 'Please enter email' })
              errorCount++
            }
            if (!otp.value) {
              otp.setError({ error: true, helperText: 'Please enter OTP' })
              errorCount++
            }
            if (errorCount === 0) {
              setLoader()
              userService
                .verifyOTP(otp.value)
                .then(() => {
                  setState(cur => ({
                    ...cur,
                    form: 'TELL_ABOUT_U',
                    isSubmitting: false,
                    error: ''
                  }))
                  setOpenOTP(false)
                })
                .catch(({ response }) => {
                  const message =
                    !!response && !!response.data && !!response.data.message
                      ? response.data.message
                      : 'Something went wrong'
                  setState(cur => ({
                    ...cur,
                    isSubmitting: false,
                    error: message
                  }))
                })
            }
          }}
          className={css.otp_form}
        >
          <div className={css.title}>
            <h2>
              Email Verification{' '}
              <IconButton aria-label="close" onClick={() => setOpenOTP(false)}>
                <XIcon />
              </IconButton>
            </h2>
            <p>Hang tight before we proceed further!</p>
          </div>
          {!!state.error && <div className={css.error_info_card}>{state.error}</div>}
          <span />
          <div className={css.info_card}>
            Enter 6 digit confirmation code (OTP) sent to <b>{email.value}</b> for verification.
          </div>
          <span />
          <FormControl variant="outlined">
            <InputLabel error={otp.params.error}>Enter confirmation code (OTP)</InputLabel>
            <OutlinedInput
              type="text"
              label="Enter confirmation code (OTP)"
              value={otp.value}
              onChange={otp.params.onChange}
              error={otp.params.error}
              endAdornment={<InputAdornment position="end">{isRunning && `${60 - countDown} Sec`}</InputAdornment>}
              inputProps={{ 'aria-label': 'otp' }}
            />
            <FormHelperText error={otp.params.error}>{otp.params.helperText}</FormHelperText>
          </FormControl>
          <Button label="Next" loading={state.isSubmitting} type="submit" disabled={state.isSubmitting} square />
          <p className={css.otp_resend}>
            Didn&apos;t receive code?{' '}
            {isRunning ? (
              <span>Resend</span>
            ) : (
              <a
                href="!#"
                style={{ fontWeight: 600 }}
                onClick={e => {
                  e.preventDefault()
                  sendOTP()
                }}
              >
                Resend
              </a>
            )}
          </p>
        </form>
      </Popup>
    </div>
  )
}

export default SignupForm
