import { useDispatch } from 'react-redux'

import { toastActions } from '../data/actions'

const useToastMessage = () => {
  const dispatch = useDispatch()

  return (message: string) => dispatch(toastActions.showToast(message))
}

export default useToastMessage
