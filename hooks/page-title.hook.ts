import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { appbarActions } from '../data/actions'

type UsePageTitleParams_ = {
  title?: string
  hideBackButton?: boolean
}

const usePageTitle = ({ title, hideBackButton }: UsePageTitleParams_) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (typeof title === 'undefined') dispatch(appbarActions.removeTitle())
    else dispatch(appbarActions.setTitle(title))

    dispatch(appbarActions[!hideBackButton ? 'showBackButton' : 'hideBackButton']())
  }, [dispatch, hideBackButton, title])
}

export default usePageTitle
