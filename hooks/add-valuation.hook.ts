import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import useIsValuationUnlock from '../api-routes/posts/valuation/is-valuation-unlock'
import { addPostActions } from '../data/actions'
import usePopup from './popup.hook'

const useAddValuation = (callback: () => any) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { openPopup } = usePopup()
  const { data } = useIsValuationUnlock()

  return () => {
    if (data?.followers && data.followings && data.generalPosts && data.top10Posts) {
      dispatch(addPostActions.setCurrentPage(router.asPath))
      router.replace('/uploads/valuation-post')
      callback()
    } else {
      openPopup('valuation-criteria')
    }
  }
}

export default useAddValuation
