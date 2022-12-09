import { IconButton, useMediaQuery } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import * as React from 'react'

import ChevronLeftIcon from '../../icons/chevron-left.icon'
import ChevronRightIcon from '../../icons/chevron-right.icon'
import css from './post-popup.module.scss'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type DialogBoxProps = {
  isOpen: boolean
  children: React.ReactNode
  onClose: () => void
  className?: string
  maxWidth?: 'xs' | 'xl' | 'sm' | 'md' | 'lg'
  onLeftArrowClick: React.MouseEventHandler<HTMLButtonElement>
  onRightArrowClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function PostPopup({
  isOpen,
  className,
  children,
  onClose,
  maxWidth,
  onLeftArrowClick,
  onRightArrowClick
}: DialogBoxProps) {
  const isMobile = useMediaQuery('(max-width:720px)')

  return (
    <Dialog
      fullScreen={isMobile}
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      classes={{ paper: `${className} ${css.paper}`, root: css.root }}
      maxWidth={maxWidth}
    >
      <div className={`${css.button} ${css.left}`}>
        <IconButton onClick={onLeftArrowClick}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      {children}
      <div className={`${css.button} ${css.right}`}>
        <IconButton aria-label="next" onClick={onRightArrowClick}>
          <ChevronRightIcon />
        </IconButton>
      </div>
    </Dialog>
  )
}
