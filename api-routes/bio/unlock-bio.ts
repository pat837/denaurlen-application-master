import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import bioQueries from './bio.routes'
import { allBiosKey } from './fetch-all-bios'
import { ownedBiosKey } from './get-owned-bios'

type SuccessCallback_ = (value?: AxiosResponse<any, any>) => void | PromiseLike<void>
type ErrorCallback_ = (reason?: any) => PromiseLike<never> | void

type UseSelectBio_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
  forUnSelect?: boolean
}

const useUnlockBio = ({ onSuccess, onError, forUnSelect = false }: UseSelectBio_) =>
  useMutation(bioQueries.unlock, {
    onSuccess: (data, variable) => {
      queryClient.setQueryData(forUnSelect ? ownedBiosKey : allBiosKey, (oldQueryData: any) => ({
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
      onSuccess()
    },
    onError: error => {
      onError()
    }
  })

export default useUnlockBio
