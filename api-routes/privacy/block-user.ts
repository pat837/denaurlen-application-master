import { InfiniteData, useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import useToastMessage from '../../hooks/toast-message.hook'
import { blockedUsersKey } from './get-blocked-users'
import routes from './privacy.routes'

import type { AxiosError, AxiosResponse } from 'axios'
import type { MutationErrorCallback_, MutationSuccessCallback_ } from '../../types'
import type { GetBlockedUsersResponse_ } from '../../types/rest.types'
type UseBlockUserParams_ = {
  callback: {
    success: MutationSuccessCallback_
    error: MutationErrorCallback_
  }
}
type Data_ = InfiniteData<AxiosResponse<GetBlockedUsersResponse_, any>>

const useBlockUser = ({ callback }: UseBlockUserParams_) => {
  const showToast = useToastMessage()

  return useMutation(routes.blockUser, {
    onSuccess: (data, variables, _context) => {
      showToast(data.data?.message || 'Profile has blocked')
      callback.success(data)
      const blockedUsers = queryClient.getQueryData<Data_>(blockedUsersKey)

      if (blockedUsers === undefined) return undefined

      queryClient.setQueryData<Data_>(blockedUsersKey, {
        ...blockedUsers,
        pages: blockedUsers.pages.map(page => ({
          ...page,
          data: {
            ...page.data,
            data: page.data.data.filter(i => i.blockedId._id !== variables.userId)
          }
        }))
      })

      queryClient.invalidateQueries(blockedUsersKey)
    },
    onError: (error: AxiosError, _variables, _context) => {
      showToast(error?.response?.data?.message || 'Something went wrong, try later')
      callback.error(error)
    }
  })
}

export default useBlockUser
