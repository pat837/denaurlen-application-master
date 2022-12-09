import { ButtonBase } from '@mui/material'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import { addPostActions } from '../../data/actions'
import useAddValuation from '../../hooks/add-valuation.hook'
import css from '../../styles/ui.module.scss'
import CameraIcon from '../icons/empty-state-camera.icon'
import ImageIcon from '../icons/image.icon'
import ConditionalRender from './conditional-render'

type EmptyStateImageProps_ = {
  type?: 'GENERAL' | 'VALUATION'
  hideCameraIcon?: boolean
}

const EmptyStateImage = ({ type, hideCameraIcon = false }: EmptyStateImageProps_) => {
  const [dispatch, router] = [useDispatch(), useRouter()]

  const addValuationPost = useAddValuation(() => {})

  const addPostHandler = () => {
    if (type === 'VALUATION') addValuationPost()
    if (type === 'GENERAL') {
      dispatch(addPostActions.setCurrentPage(router.asPath))
      router.replace(`/uploads/${type.toLocaleLowerCase()}-post`)
    }
  }

  return (
    <ButtonBase className={css['empty-state-img']} onClick={addPostHandler}>
      <div data-icon-wrapper>
        <ConditionalRender condition={hideCameraIcon}>
          <ImageIcon />
          <CameraIcon />
        </ConditionalRender>
        {!type || <span>Add Post</span>}
      </div>
    </ButtonBase>
  )
}

export default EmptyStateImage
