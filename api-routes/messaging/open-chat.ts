import { useMutation } from 'react-query'

import chatRoutes from './messaging.routes'
import http from '../../config/http'

import type { ErrorCallback_, SuccessCallback_ } from '../../types'
import type { Conversation_ as Res_ } from '../../types/messaging.types'

type UseOpenChat_ = {
  onError: ErrorCallback_
  onSuccess: SuccessCallback_
}

type OpenChat_ = { profileId: string }

const openChat = ({ profileId }: OpenChat_) => http.post<Res_>(chatRoutes.openChat(profileId))

const useOpenChat = ({ onError, onSuccess }: UseOpenChat_) =>
  useMutation(openChat, {
    onSuccess(data, variables, context) {
      onSuccess(data)
    },
    onError(error, variables, context) {
      onError(error)
    }
  })

export default useOpenChat
