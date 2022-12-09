import { Divider, useMediaQuery } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef, ReactElement, Ref } from 'react'

import css from '../../styles/components/ui/popup.module.scss'

const TransitionSlider = (
  props: TransitionProps & {
    children: ReactElement<any, any>
  },
  ref: Ref<unknown>
) => <Slide direction="up" ref={ref} {...props} />

export const Transition = forwardRef(TransitionSlider)

type DialogBoxProps = {
  isOpen: boolean
  children: React.ReactNode
  onClose: () => void
  titleSection?: React.ReactNode
  className?: string
  maxWidth?: 'xs' | 'xl' | 'sm' | 'md' | 'lg'
  disableIndexZ?: boolean
}

export default function DialogBox({
  isOpen,
  className,
  children,
  onClose,
  titleSection,
  maxWidth,
  disableIndexZ = false
}: DialogBoxProps) {
  const isMobile = useMediaQuery('(max-width:720px)')

  return (
    <Dialog
      fullScreen={isMobile}
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      classes={{ paper: className, root: css.drawer_root }}
      maxWidth={maxWidth}
      style={disableIndexZ ? {} : { zIndex: 99999 }}
    >
      {!!titleSection && (
        <>
          <DialogTitle>{titleSection}</DialogTitle>
          <Divider />
        </>
      )}
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}
