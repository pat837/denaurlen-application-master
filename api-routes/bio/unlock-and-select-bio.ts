import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import bioQueries from './bio.routes'
import { allBiosKey } from './fetch-all-bios'
import { activeBioKey } from './get-active-bio'
import { ownedBiosKey } from './get-owned-bios'

type SuccessCallback_ = (value?: AxiosResponse<any, any>) => void | PromiseLike<void>
type ErrorCallback_ = (reason?: any) => PromiseLike<never> | void

type UseSelectBio_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useUnlockAndSelect = ({ onSuccess, onError }: UseSelectBio_) =>
  useMutation(bioQueries.unlockAndSelect, {
    onSuccess: (data, variable) => {
      queryClient.setQueryData(allBiosKey, (oldQueryData: any) => ({
        ...oldQueryData,
        pages: oldQueryData.pages.map((page: any) => ({
          ...page,
          data: {
            ...page.data,
            data: page.data.data.filter((bio: { _id: string }) => bio._id !== variable)
          }
        }))
      }))
      queryClient.invalidateQueries(ownedBiosKey)
      queryClient.invalidateQueries(allBiosKey)
      queryClient.invalidateQueries(activeBioKey)
      onSuccess()
    },
    onError: error => {
      onError()
    }
  })

export default useUnlockAndSelect
