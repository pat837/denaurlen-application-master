import axios, { Canceler } from 'axios'

import http from '../config/http'

type loginParams = {
  username: string
  password: string
}
type signupParams = {
  username: string
  password: string
  email: string
  name: string
  gender: string
  dateOfBirth: string
  location: number[]
  place: string
  country: string
  countryCode: string
  referredCode: string
}

type signupWithGoogleParams = { tokenId: string } & signupParams

const userService = {
  login: (user: loginParams) => http.post('/auth/signin', user),
  isEmailExists: (email: string) => http.post('/auth/email/exists', { email }),
  signinWithGoogle: (tokenId: string) => http.post('/auth/google-signin', { tokenId }),
  logout: () => http.get('/auth/logout'),
  isLoggedIn: () => http.get('/is-login'),
  verifyOTP: (otp: string | number) => http.post('/auth/email/verify-otp', { otp }),
  usernameExists: (username: string) => {
    let cancel: Canceler
    return http({
      method: 'POST',
      url: '/auth/username/exists',
      data: { username: username },
      cancelToken: new axios.CancelToken(c => (cancel = c))
    })
  },
  sendSignupOTP: (email: string) => http.post('/auth/email/signup-otp', { email }),
  signup: (user: signupParams) => http.post('/auth/signup', user),
  signupWithGoogle: (user: signupWithGoogleParams) => http.post('/auth/google-signup', user)
}

export default userService
