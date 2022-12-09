import { Drawer } from '@mui/material'
import router from 'next/router'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useIsValuationUnlock from '../../api-routes/posts/valuation/is-valuation-unlock'
import useUnlockValuation from '../../api-routes/posts/valuation/unlock-valuation'
import { addPostActions, navbarActions } from '../../data/actions'
import useAddValuation from '../../hooks/add-valuation.hook'
import usePopup from '../../hooks/popup.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import css from '../../styles/bottom-navbar.module.scss'
import AddStoryIcon from '../icons/add-story.icon'
import GeneralPostIcon from '../icons/general-post.icon'
import TopTenPostIcon from '../icons/top10-post.icon'
import ValuationPostIcon from '../icons/valuationPostIcon'
import { AddButton } from './add-option'
import Button from './button'
import ConditionalRender from './conditional-render'
import Popup from './popup'

import type { AddButtonProps, storeType } from '../../types'

export const ValuationCriteriaPopup = () => {
  const dispatch = useDispatch()
  const showToast = useToastMessage()

  const closeHandler = () => dispatch(navbarActions.closeAddOption())

  const { data } = useIsValuationUnlock()
  const { isOpen, closePopup } = usePopup()

  const { mutate: unlockValuation } = useUnlockValuation({
    onError: () => {
      showToast('Something went wrong')
    },
    onSuccess: () => {
      showToast('Now you can upload valuation post')
      closeHandler()
      closePopup()
    }
  })

  const unlockValuationHandler = () => {
    unlockValuation()
  }

  return (
    <Popup open={isOpen('valuation-criteria')} onClose={closePopup}>
      <div className={css.criteria_popup}>
        <h3>
          You need to unlock
          <br />
          Valuation process
        </h3>
        <p>For uploading valuation post you need to match the following criteria</p>

        <ul>
          <li className={(data?.followers && css.unlocked) || undefined}>
            <p>You need to have at least 10 followers</p>
            <span>You have {data?.counts.followers} followers</span>
          </li>
          <li className={(data?.followings && css.unlocked) || undefined}>
            <p>You need to follow at least 10 profiles</p>
            <span>You following {data?.counts.followings} profiles</span>
          </li>
          <li className={(data?.generalPosts && css.unlocked) || undefined}>
            <p>You need to Upload at least 10 General posts</p>
            <span>You uploaded {data?.counts.generalPosts} post</span>
          </li>
          <li className={(data?.top10Posts && css.unlocked) || undefined}>
            <p>You need to Upload at least 10 Top10 posts</p>
            <span>You uploaded {data?.counts.top10Posts} post</span>
          </li>
        </ul>

        <ConditionalRender
          condition={(data?.followers && data.followings && data.generalPosts && data.top10Posts) || false}
        >
          <Button label="unlock" onClick={unlockValuationHandler} />
          <Button
            label="close"
            onClick={() => {
              closePopup()
              closeHandler()
            }}
          />
        </ConditionalRender>
      </div>
    </Popup>
  )
}

const BottomAddOptionPopup = () => {
  const [state, dispatch, showToast] = [
    useSelector((state: storeType) => state.navbar),
    useDispatch(),
    useToastMessage()
  ]

  const closeHandler = () => dispatch(navbarActions.closeAddOption())

  const addValuationPost = useAddValuation(closeHandler)

  const [addLinks] = useState<AddButtonProps[]>([
    {
      label: 'valuation',
      onClick: () => {
        showToast('This feature will enabled in future updates')
        if ('vibrate' in navigator) navigator?.vibrate(100)
      },
      icon: <ValuationPostIcon />
    },
    {
      label: "top 10's",
      onClick: () => {
        closeHandler()
        dispatch(addPostActions.clearCategoryAndSlot())
        dispatch(addPostActions.setCurrentPage(router.asPath))
        router.replace('/uploads/category-post')
      },
      icon: <TopTenPostIcon />
    },
    {
      label: 'general',
      onClick: () => {
        closeHandler()
        dispatch(addPostActions.setCurrentPage(router.asPath))
        router.replace('/uploads/general-post')
      },
      icon: <GeneralPostIcon />
    },
    {
      label: 'story',
      onClick: () => {
        closeHandler()
        dispatch(addPostActions.setCurrentPage(router.asPath))
        router.replace('/uploads/story')
      },
      icon: <AddStoryIcon />
    }
  ])

  return (
    <>
      <Drawer
        variant="temporary"
        anchor="bottom"
        open={state.showAddOption}
        onClose={closeHandler}
        classes={{ paper: css['add-option-wrapper'], root: css.popup_root }}
      >
        <div className={css.btn_wrapper}>
          {addLinks.map(({ icon, label, onClick }, _) => (
            <AddButton key={`add-btn-${_}`} icon={icon} label={label} onClick={onClick} />
          ))}
        </div>
      </Drawer>
      <ValuationCriteriaPopup />
    </>
  )
}

export default BottomAddOptionPopup
