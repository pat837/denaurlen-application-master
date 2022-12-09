import { InfiniteData, useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import useToastMessage from '../../hooks/toast-message.hook'
import { muteUsersKey } from './get-muted-users'
import routes from './privacy.routes'

import type { AxiosError, AxiosResponse } from 'axios'
import type { MutationErrorCallback_, MutationSuccessCallback_ } from '../../types'
import type { GetMutedUsersResponse_ } from '../../types/rest.types'

type UseMuteUserParams_ = {
  callback: {
    success: MutationSuccessCallback_
    error: MutationErrorCallback_
  }
}
type Data_ = InfiniteData<AxiosResponse<GetMutedUsersResponse_, any>>

const useMuteUser = ({ callback }: UseMuteUserParams_) => {
  const showToast = useToastMessage()

  return useMutation(routes.muteUser, {
    onSuccess: (data, variables, _context) => {
      showToast(data.data?.message || 'Profile has muted')
      callback.success(data)

      const mutedUsers = queryClient.getQueryData<Data_>(muteUsersKey)

      if (mutedUsers === undefined) return undefined

      queryClient.setQueryData<Data_>(muteUsersKey, {
        ...mutedUsers,
        pages: mutedUsers.pages.map(page => ({
          ...page,
          data: {
            ...page.data,
            data: page.data.data.filter(i => i.mutedId._id === variables.userId)
          }
        }))
      })

      queryClient.invalidateQueries(muteUsersKey)
    },
    onError: (error: AxiosError, _variables, _context) => {
      showToast(error?.response?.data?.message || 'Something went wrong, try later')
      callback.error(error)
    }
  })
}

export default useMuteUser
