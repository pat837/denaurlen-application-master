import { PaginationResponse_, PostUploaderWithName_ } from '.'

export type BlockUsersParams_ = {
  userId: string
}

export type GetBlockedUsersResponse_ = PaginationResponse_ & {
  data: {
    _id: string
    userId: string
    blockedId: PostUploaderWithName_
    createdAt: Date
    updatedAt: Date
  }[]
}

export type MuteUsersParams_ = BlockUsersParams_

export type GetMutedUsersResponse_ = PaginationResponse_ & {
  data: {
    _id: string
    userId: string
    mutedId: PostUploaderWithName_
    createdAt: Date
    updatedAt: Date
  }[]
}
