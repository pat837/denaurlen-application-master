import { ButtonBase } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addPostActions, navbarActions } from '../../data/actions'
import useAddValuation from '../../hooks/add-valuation.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import css from '../../styles/bottom-navbar.module.scss'
import { AddButtonProps, storeType } from '../../types'
import AddStoryIcon from '../icons/add-story.icon'
import GeneralPostIcon from '../icons/general-post.icon'
import TopTenPostIcon from '../icons/top10-post.icon'
import ValuationPostIcon from '../icons/valuationPostIcon'
import DialogBox from './dialog-box'

export const AddButton = ({ label, onClick, icon }: AddButtonProps) => (
  <div className={css['add-btn']}>
    <ButtonBase aria-label={`add-${label}-post`} onClick={onClick}>
      {icon}
    </ButtonBase>
    <p>{label}</p>
  </div>
)

const AddOption = () => {
  const [state, dispatch, showToast] = [
    useSelector((state: storeType) => state.navbar),
    useDispatch(),
    useToastMessage()
  ]

  const router = useRouter()

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
    <DialogBox isOpen={state.showAddOption} onClose={closeHandler}>
      <div className={css['add-option-popup']}>
        <h5>Add Post</h5>
        <div data-btn-wrapper>
          {addLinks.map(({ icon, label, onClick }, _) => (
            <AddButton key={`add-button-${_}`} icon={icon} label={label} onClick={onClick} />
          ))}
        </div>
      </div>
    </DialogBox>
  )
}

export default AddOption
