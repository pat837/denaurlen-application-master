import http from '../../config/http'
import {
  BlockUsersParams_,
  GetBlockedUsersResponse_,
  GetMutedUsersResponse_,
  MuteUsersParams_
} from '../../types/rest.types'

import type { PaginationParams_ } from '../../types'

const routes = {
  block: {
    get: '/user/privacy/block-user',
    user: (userId: string) => `/user/privacy/block-user/${userId}`
  },
  mute: {
    get: '/user/privacy/mute-user',
    user: (userId: string) => `/user/privacy/mute-user/${userId}`
  }
}

const getBlockedUsers = (params: PaginationParams_) =>
  http.get<GetBlockedUsersResponse_>(routes.block.get, { params })

const blockUser = ({ userId }: BlockUsersParams_) => http.post(routes.block.user(userId))

const getMutedUsers = (params: PaginationParams_) =>
  http.get<GetMutedUsersResponse_>(routes.mute.get, { params })

const muteUser = ({ userId }: MuteUsersParams_) => http.post(routes.mute.user(userId))

const privacyRoutes = {
  getBlockedUsers,
  blockUser,
  getMutedUsers,
  muteUser
}

export default privacyRoutes
