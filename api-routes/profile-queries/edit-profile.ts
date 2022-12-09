import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import { profileKey } from './fetch-profile'
import profileQueries from './profile.routes'

import type { ErrorCallback_, SuccessCallback_ } from '../../types'
import type { Profile_ } from '../../types/profile.type'

type UseEditProfile_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useEditProfile = ({ onSuccess, onError }: UseEditProfile_) => {
  return useMutation(profileQueries.profile.edit, {
    onSuccess: (data, _variables, _context) => {
      const profileData = queryClient.getQueryData<AxiosResponse<Profile_, any>>(profileKey)
      queryClient.setQueryData(profileKey, () =>
        profileData === undefined
          ? profileData
          : {
              ...data,
              data: {
                ...profileData.data,
                ...data.data,
                bio: profileData.data.bio
              }
            }
      )
      onSuccess(data.data)
    },
    onError: (error, _variables, _context) => {
      onError(error)
    }
  })
}

export default useEditProfile
