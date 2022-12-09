import { useMutation } from 'react-query'

import { ErrorCallback_, SuccessCallback_ } from '../../types'
import settingsRoutes from './settings.routes'

type UseChangePasswordParams_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useChangePassword = ({ onError, onSuccess }: UseChangePasswordParams_) =>
  useMutation(settingsRoutes.login.changePassword, {
    onSuccess: (data, variables, context) => {
      onSuccess()
    },
    onError(error, variables, context) {
      onError(error)
    }
  })

export default useChangePassword
