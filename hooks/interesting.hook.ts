import { useDispatch, useSelector } from 'react-redux'

import useInterestCategoryPost from '../api-routes/posts/category/interest-post'
import useInterestValuationPost from '../api-routes/posts/valuation/interest-post'
import { systemOptionsActions } from '../data/actions'
import usePopup from './popup.hook'

import type { ErrorCallback_, storeType, SuccessCallback_ } from '../types'

type UseInterestingParams_ = {
  type: 'category' | 'valuation'
  callback: {
    success: SuccessCallback_
    error: ErrorCallback_
  }
}

const useInteresting = ({ type, callback }: UseInterestingParams_) => {
  const { openPopup } = usePopup()
  const dispatch = useDispatch()
  const {
    confirmPopups: { interesting }
  } = useSelector((s: storeType) => s.systemOptions)

  const { mutate: category } = useInterestCategoryPost({
    errorCallback: callback.error,
    successCallback: callback.success
  })

  const { mutate: valuation } = useInterestValuationPost({
    onError: callback.error,
    onSuccess: callback.success
  })

  return (postId: string) => {
    dispatch(systemOptionsActions.confirmPopups.interesting.incrementClicks())

    if (interesting.show)
      return openPopup((type === 'category' && 'category-interesting') || 'valuation-interesting', {
        params: {
          post: postId
        }
      })

    if (type === 'category') return category(postId)

    valuation(postId)
  }
}

export default useInteresting
