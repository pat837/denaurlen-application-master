import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import useOpenChat from '../api-routes/messaging/open-chat'
import { messageActions } from '../data/actions'
import useToastMessage from './toast-message.hook'

const useMessageHandler = () => {
  const [dispatch, router, showToast] = [useDispatch(), useRouter(), useToastMessage()]

  const { mutate: openChat } = useOpenChat({
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Something went wrong')
      router.replace('/messaging')
    },
    onSuccess: (res: any) => {
      dispatch(messageActions.setConversation(res.data))
    }
  })

  return (profileId: string, replace = false) => {
    dispatch(messageActions.clearConversation())
    router[replace ? 'replace' : 'push']('/messaging/chat')
    openChat({ profileId })
  }
}

export default useMessageHandler
