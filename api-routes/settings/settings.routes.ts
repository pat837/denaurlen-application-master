import http from '../../config/http'

import type { PostUploaderWithName_ } from '../../types'

type ChangePasswordParams_ = { oldPassword: string; newPassword: string }
type SetPasswordParams_ = { newPassword: string }

export type LoginDevice_ = {
  _id: string
  user: string
  osName: string
  clientName: string
  deviceType: 'smartphone' | 'desktop' | 'tablet'
  deviceBrand: string
  deviceModel: string
  createdAt: Date
  updatedAt: Date
}
type GetLoginDevicesParams_ = { page: number; size: number }
export type GetLoginDevices_ = {
  pages: number
  currentPage: number
  currentDevice: LoginDevice_
  otherDevices: LoginDevice_[]
}

type RemoveDeviceParams_ = {
  deviceId: string
}

const urls = {
  login: {
    changePassword: '/user/settings/account/change-password',
    removeDevice: (deviceId: string) => `/user/settings/logins/${deviceId}`,
    getLoginDevice: '/user/settings/logins',
    setPassword: '/user/settings/account/set-password'
  },
  referral: {
    list: 'user/referral/users',
    count: 'user/referral/users-count'
  }
}

const changePassword = (params: ChangePasswordParams_) => {
  return http.put(urls.login.changePassword, params)
}

const setPassword = (params: SetPasswordParams_) => {
  return http.post(urls.login.setPassword, params)
}

const fetchLoginDevices = (params: GetLoginDevicesParams_) =>
  http.get<GetLoginDevices_>(urls.login.getLoginDevice, { params })

const removeDevice = ({ deviceId }: RemoveDeviceParams_) => {
  return http.delete(urls.login.removeDevice(deviceId))
}

const getReferralCount = () => http.get<{ data: number }>(urls.referral.count)

const getReferralList = () => http.get<{ data: PostUploaderWithName_[] }>(urls.referral.list)

const settingsRoutes = {
  login: {
    changePassword,
    removeDevice,
    getLoginDevice: fetchLoginDevices,
    setPassword
  },
  referral: {
    count: getReferralCount,
    list: getReferralList
  }
}

export default settingsRoutes
