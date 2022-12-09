import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import valuationPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'

type SuccessCallback_ = (value?: AxiosResponse<any, any> | any) => void | PromiseLike<void>
type ErrorCallback_ = (reason?: any) => PromiseLike<never> | void

type UseSetLead_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
  currentUser: {
    _id: string
    username: string
    profilePic: string
    name: string
  }
}

const useSetLead = ({ onError, onSuccess, currentUser }: UseSetLead_) => {
  return useMutation(valuationPostQueries.lead.set, {
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(getKeys.post.valuation.getLead(variables))
      onSuccess(data)
    },
    onError: (error, variables, context) => {
      onError(error)
    }
  })
}

export default useSetLead
