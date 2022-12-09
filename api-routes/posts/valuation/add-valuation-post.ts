import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import valuationPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'

type SuccessCallback_ = (value?: AxiosResponse<any, any>) => void | PromiseLike<void>
type ErrorCallback_ = (reason?: any) => PromiseLike<never> | void

type UseAddValuationPost_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
  username: string
}

const useAddValuationPost = ({ onSuccess, onError, username }: UseAddValuationPost_) => {
  return useMutation(valuationPostQueries.upload, {
    onSuccess: () => {
      queryClient.invalidateQueries(getKeys.post.counts(username))
      queryClient.invalidateQueries(getKeys.story.premium.get(username))
      onSuccess()
    },
    onError: (error) => {
      onError(error)
    }
  })
}

export default useAddValuationPost
