import { useMutation } from 'react-query'
import valuationPostQueries from '.'
import { ErrorCallback_, SuccessCallback_ } from '../../../types'

type UseIsValuationUnlockParams_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useUnlockValuation = ({ onError, onSuccess }: UseIsValuationUnlockParams_) =>
  useMutation(valuationPostQueries.unlockValuation, {
    onSuccess(data, variables, context) {
      onSuccess(data)
    },
    onError(error, variables, context) {
      onError(error)
    }
  })

export default useUnlockValuation
