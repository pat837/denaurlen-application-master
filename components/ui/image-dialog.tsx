import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import * as React from 'react'

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
  titleSection?: React.ReactNode
  className?: string
}

export default function ImageDialog({
  isOpen,
  className,
  children,
  onClose,
  titleSection
}: DialogBoxProps) {
  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      classes={{ paper: className }}
    >
      {!!titleSection && (
        <>
          <DialogTitle>{titleSection}</DialogTitle>
          <hr color="#E2E2E2" />
        </>
      )}
      {children}
    </Dialog>
  )
}
