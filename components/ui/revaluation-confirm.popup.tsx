import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import useRevaluationHandler from '../../api-routes/posts/valuation/revalue-post'
import { numberFormat } from '../../utils'
import { postActions } from '../../data/actions'
import useToastMessage from '../../hooks/toast-message.hook'
import css from '../../styles/components/ui/revaluation-popup.module.scss'
import Button from './button'
import Popup from './popup'

import type { storeType } from '../../types'
const RevaluationConfirmPopup = () => {
  const [dispatch, router, { revalueAmount, revalueFor, revalueType }, showToast] = [
    useDispatch(),
    useRouter(),
    useSelector((state: storeType) => state.postState),
    useToastMessage()
  ]

  const closeHandler = () => dispatch(postActions.closeRevaluationPopup())

  const { mutate: revaluate, isLoading } = useRevaluationHandler({
    type: revalueType,
    callback: {
      success: res => {
        router.push('/profile')
        showToast(res?.data?.message || 'Post is on valuation')
        closeHandler()
      },
      error: error => {
        showToast(error?.response?.data?.message || 'Something went wrong, try later')
      }
    }
  })

  const revaluationHandler = () => revaluate({ postId: revalueFor })

  return (
    <Popup open={!!revalueFor} onClose={closeHandler}>
      <div className={css.root}>
        <div className={css.wrapper}>
          <h3>Revaluate the post</h3>
          <p>You need to spend {numberFormat(revalueAmount)} coins to revalue the post</p>
          <span>Coins earned after valuation will added to your wallet</span>
          <div className={css.btn_group}>
            <Button label="cancel" variant="contained" onClick={closeHandler} />
            <Button label="continue" type="submit" onClick={revaluationHandler} loading={isLoading} />
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default RevaluationConfirmPopup
