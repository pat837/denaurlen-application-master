/* eslint-disable react-hooks/exhaustive-deps */
import { Drawer, TextField, useMediaQuery } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import WelcomeIllustration from '../assets/welcome-illustration'
import SignupForm from '../components/forms/signup'
import Button from '../components/ui/button'
import DialogBox from '../components/ui/dialog-box'
import constants from '../config/constants'
import http from '../config/http'
import useFormField from '../hooks/form-field.hook'
import useToastMessage from '../hooks/toast-message.hook'
import css from '../styles/pages/auth.page.module.scss'

const SignupPage = () => {
  const [route, isMobile] = [useRouter(), useMediaQuery('(max-width: 722px)')]
  const showToast = useToastMessage()

  const [state, setState] = useState({
    isOpen: true,
    referralCode: '',
    form: {
      name: '',
      email: '',
      phone: ''
    },
    isSubmitting: false,
    isRequestScreen: false,
    error: ''
  })

  useEffect(() => {
    const referralCode = window.sessionStorage.getItem(constants.REFERRAL_CODE)
    const referral = route.query?.referral?.toString()

    setState({ ...state, referralCode: referral || referralCode || '' })
  }, [])

  const name = useFormField({})
  const email = useFormField({})
  const phoneNo = useFormField({})

  const referralCodeChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const referralCode = e.target.value
    if (referralCode.length > 6) return
    setState({
      ...state,
      referralCode: referralCode.toUpperCase()
    })
  }

  const goToLogin = () => route.push('/login')

  const setRequestScreen = () =>
    setState({
      ...state,
      isRequestScreen: true,
      error: ''
    })
  const goBack = () =>
    setState({
      ...state,
      isRequestScreen: false,
      error: ''
    })

  const verifyReferralCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!state.referralCode)
      return setState({
        ...state,
        error: 'Please enter your referral code'
      })

    if (!!state.referralCode && state.referralCode.length !== 6)
      return setState({
        ...state,
        error: 'The referral code should contain 6 characters'
      })

    if (!!state.referralCode) {
      setState({ ...state, isSubmitting: true })
      http
        .post('/auth/referral', { referralCode: state.referralCode })
        .then(({ data }) => {
          if (data.isReferralValid) {
            setState({ ...state, isOpen: false, isSubmitting: false })
            window.sessionStorage.setItem(constants.REFERRAL_CODE, state.referralCode)
          } else setState({ ...state, error: 'Invalid Referral Code', isSubmitting: false })
        })
        .catch(({ response }) =>
          setState({
            ...state,
            error: response?.data?.message || 'Something went wrong',
            isSubmitting: false
          })
        )
    }
  }

  const requestReferralCode = () => {
    setState({ ...state, isSubmitting: true })

    http
      .post('/auth/referral-request', {
        name: name.value,
        phone: phoneNo.value,
        email: email.value
      })
      .then(() => {
        showToast('Your request has been submitted')
        route.replace('/login')
      })
      .catch(({ response }) =>
        setState({
          ...state,
          error: response?.data?.message || 'Something went wrong',
          isSubmitting: false
        })
      )
  }

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let errorCount = 0

    if (!phoneNo.value) {
      errorCount++
      setState({
        ...state,
        error: 'Please enter your phone number'
      })
    }
    if (!email.value) {
      errorCount++
      setState({
        ...state,
        error: 'Please enter your email address'
      })
    } else if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email.value)) {
      setState({
        ...state,
        error: 'Please enter a valid email address'
      })
      errorCount++
    }
    if (!name.value) {
      errorCount++
      setState({
        ...state,
        error: 'Please enter your full name'
      })
    } else if (!/^[a-zA-Z ]*$/.test(name.value)) {
      setState({
        ...state,
        error: 'Name should contain only alphabets and space'
      })
      errorCount++
    } else if (name.value.length < 3) {
      setState({
        ...state,
        error: 'Name should contain at least 3 characters'
      })
      errorCount++
    } else if (name.value.length > 30) {
      setState({
        ...state,
        error: 'Name should not be more then 30 characters'
      })
      errorCount++
    }

    if (errorCount === 0) requestReferralCode()
  }

  return (
    <>
      <Head>
        <title>SIGN UP | Denaurlen</title>
      </Head>
      <div className={css.wrapper}>
        <div className={css.form_container}>
          <SignupForm />
        </div>
        <div className={css.illustration_wrapper}>
          <div className={css.illustrator_container}>
            <WelcomeIllustration />
          </div>
        </div>
      </div>
      {isMobile ? (
        <Drawer
          variant="temporary"
          anchor="bottom"
          open={state.isOpen}
          onClose={() => null}
          classes={{ paper: css['referral-drawer-wrapper'] }}
        >
          <div className={css['referral-drawer']}>
            <div className={css['referral-code-dialog']}>
              {!!state.error && <div className={css.error_info_card}>{state.error}</div>}
              {state.isRequestScreen ? (
                <>
                  <h3>Request for a Referral Code</h3>
                  <form autoComplete="off" onSubmit={submitHandler}>
                    <TextField fullWidth label="Full Name" {...name.params} />
                    <TextField fullWidth label="Email" {...email.params} />
                    <TextField fullWidth label="Phone Number" type="tel" {...phoneNo.params} />
                    <div className={css.btn_cont}>
                      <Button label="Back" type="reset" variant="outline" onClick={goBack} />
                      <Button label="Request" type="submit" loading={state.isSubmitting} />
                    </div>
                  </form>
                </>
              ) : (
                <form autoComplete="off" style={{ gap: 0 }} onSubmit={verifyReferralCode}>
                  <h3>Enter Referral Code</h3>
                  <TextField
                    autoFocus
                    fullWidth
                    label="Enter 6 Digit Code"
                    value={state.referralCode}
                    onChange={referralCodeChangeHandler}
                  />
                  <p>
                    Want to request for a code? <a onClick={setRequestScreen}>Click Here</a>
                  </p>
                  <div className={css['btn-wrapper']}>
                    <Button label="Submit" type="submit" loading={state.isSubmitting} square />
                  </div>
                </form>
              )}
              <p>
                Already a User? &nbsp;<a onClick={goToLogin}>Sign In</a>
              </p>
            </div>
          </div>
        </Drawer>
      ) : (
        <DialogBox className={css['referral-code-dialog']} isOpen={state.isOpen} onClose={() => null}>
          {!!state.error && <div className={css.error_info_card}>{state.error}</div>}
          {state.isRequestScreen ? (
            <>
              <h3>Request for a Referral Code</h3>
              <form autoComplete="off" onSubmit={submitHandler}>
                <TextField fullWidth label="Full Name" {...name.params} />
                <TextField fullWidth label="Email" {...email.params} />
                <TextField
                  fullWidth
                  label="Phone Number"
                  inputProps={{ pattern: '[0-9]', type: 'number' }}
                  {...phoneNo.params}
                />
                <div className={css.btn_cont}>
                  <Button label="Back" type="reset" variant="outline" onClick={goBack} />
                  <Button label="Request" type="submit" loading={state.isSubmitting} />
                </div>
              </form>
            </>
          ) : (
            <form autoComplete="off" style={{ gap: 0 }} onSubmit={verifyReferralCode}>
              <h3>Enter Referral Code</h3>
              <TextField
                autoFocus
                fullWidth
                label="Enter 6 Digit Code"
                value={state.referralCode}
                onChange={referralCodeChangeHandler}
              />
              <p>
                Want to request for a code? <a onClick={setRequestScreen}>Click Here</a>
              </p>
              <div className={css['btn-wrapper']}>
                <Button label="Submit" square type="submit" loading={state.isSubmitting} />
              </div>
            </form>
          )}
          <p>
            Already a User? &nbsp;<a onClick={goToLogin}>Sign In</a>
          </p>
        </DialogBox>
      )}
    </>
  )
}

SignupPage.isInSecure = true

export default SignupPage
