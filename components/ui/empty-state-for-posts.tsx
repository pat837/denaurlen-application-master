import { ReactNode } from 'react'

import EmptyStateCameraIcon from '../icons/empty-state-camera.icon'
import css from './../../styles/ui.module.scss'

const EmptyStateForPosts = ({ text }: { text: string | ReactNode }) => {
  return (
    <div className={css['empty-state-wrapper']}>
      <EmptyStateCameraIcon />
      {text}
    </div>
  )
}

export default EmptyStateForPosts
