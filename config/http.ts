import axios from 'axios'
import constants from './constants'
import storage from './storage'
import { getBaseURL } from '../utils/get-url'

const { AUTHORIZATION, AUTHORIZATION_LS, REFRESH_TOKEN, REFRESH_TOKEN_LS, OTP_TOKEN, OTP_TOKEN_LS } =
  constants

const http = axios.create({
  baseURL: `${getBaseURL()}/api`,
  withCredentials: true,
  timeout: 1000 * 60
})

http.interceptors.request.use(req => {
  const [accessToken, refreshToken, otpToken] = [
    storage.local.get(AUTHORIZATION_LS),
    storage.local.get(REFRESH_TOKEN_LS),
    storage.session.get(OTP_TOKEN_LS)
  ]

  if (!!req.headers) {
    req.headers[AUTHORIZATION] = accessToken?.token || ''
    req.headers[REFRESH_TOKEN] = refreshToken?.token || ''
    req.headers[OTP_TOKEN] = otpToken?.token || ''
  }
  return req
})

http.interceptors.response.use(res => {
  const [accessToken, refreshToken, otpToken] = [
    res.headers[AUTHORIZATION],
    res.headers[REFRESH_TOKEN],
    res.headers[OTP_TOKEN]
  ]

  if (!!accessToken && !!refreshToken) {
    storage.local.add({ key: AUTHORIZATION_LS, value: { token: accessToken } })
    storage.local.add({ key: REFRESH_TOKEN_LS, value: { token: refreshToken } })
  }

  if (!!otpToken) storage.session.add({ key: OTP_TOKEN_LS, value: { token: otpToken } })

  return res
})

export default http
