import { useMutation } from 'react-query'

import { ErrorCallback_, SuccessCallback_ } from '../../types'
import settingsRoutes from './settings.routes'

type UseSetPasswordParams_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useSetPassword = ({ onError, onSuccess }: UseSetPasswordParams_) =>
  useMutation(settingsRoutes.login.setPassword, {
    onSuccess: (data, variables, context) => {
      onSuccess()
    },
    onError(error, variables, context) {
      onError(error)
    }
  })

export default useSetPassword
