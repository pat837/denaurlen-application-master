import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import useInterestCategoryPost from '../../../api-routes/posts/category/interest-post'
import { systemOptionsActions } from '../../../data/actions'
import usePopup from '../../../hooks/popup.hook'
import useToastMessage from '../../../hooks/toast-message.hook'
import InterestedIcon from '../../icons/interested.icon'
import Button from '../../ui/button'
import Checkbox from '../../ui/checkbox'
import Popup from '../../ui/popup'
import css from './interesting-popup.module.scss'

const CategoryInterestPopup = () => {
  const showToast = useToastMessage()
  const { closePopup, isOpen } = usePopup()
  const router = useRouter()
  const [check, setCheck] = useState(false)

  const dispatch = useDispatch()
  const closeHandler = () => {
    closePopup()
    if (check) dispatch(systemOptionsActions.confirmPopups.interesting.toggle())
  }

  const checkHandler = () => setCheck(!check)

  const { mutate: interestHandler } = useInterestCategoryPost({
    errorCallback: () => {
      showToast('Unable to Interest post, try again later.')
    },
    successCallback: () => {}
  })

  const handleInterest = (postId: string) => () => {
    interestHandler(postId)
    closeHandler()
  }

  return (
    <Popup open={isOpen('category-interesting')} onClose={closeHandler}>
      <div className={css.wrapper}>
        <div className={css.container}>
          <InterestedIcon />
          <h4>Interesting</h4>
          <p>By interesting the post 20 coins will be transferred from your wallet to post uploader</p>
          <Checkbox checked={check} label="Don't show this again" onChange={checkHandler} />
          <span />
          <Button
            label="interest the post"
            onClick={handleInterest(router.query?.post?.toString() || '')}
          />
          <span />
          <span className={css.note}>Interesting can not be undo</span>
        </div>
      </div>
    </Popup>
  )
}

export default CategoryInterestPopup
