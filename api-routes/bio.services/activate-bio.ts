import { AxiosResponse } from 'axios'
import { useContext } from 'react'
import { useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import { ProfileContext } from '../../contexts/profile.context'
import BioRoutes from './bio.routes'
import { activeBioKey } from './get-active-bio'
import { ownedBiosKey } from './get-owned-bios'

type SuccessCallback_ = (value?: AxiosResponse<any, any> | any) => void | PromiseLike<void>
type ErrorCallback_ = (reason?: any) => PromiseLike<never> | void

type UseSetBio_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
  isUnSelect?: boolean
}

const useActiveBio = ({ onSuccess, onError, isUnSelect = false }: UseSetBio_) => {
  const { refetchProfile } = useContext(ProfileContext)

  return useMutation(BioRoutes.activate, {
    onSuccess: (data, variable) => {
      const emptyBio = { _id: '', name: '', src: '', meaning: '', price: 0 }

      queryClient.setQueryData(activeBioKey, (oldQueryData: any) => ({
        ...oldQueryData,
        data: isUnSelect ? emptyBio : variable
      }))
      refetchProfile()
      onSuccess(variable)
      queryClient.invalidateQueries(ownedBiosKey)
    },
    onError: () => {
      onError()
    }
  })
}

export default useActiveBio
