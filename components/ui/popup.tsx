import { Drawer, useMediaQuery } from '@mui/material'
import { ReactNode } from 'react'

import css from '../../styles/components/ui/popup.module.scss'
import DialogBox from './dialog-box'

type PopupProps_ = {
  children: ReactNode
  open: boolean
  onClose: () => any
  isPage?: boolean
}

const Popup = ({ children, open, onClose, isPage = false }: PopupProps_) => {
  const isDesktop = useMediaQuery('(min-width: 722px)')

  if (isDesktop)
    return (
      <DialogBox isOpen={open} onClose={onClose}>
        {children}
      </DialogBox>
    )

  const style = (isPage && `${css.wrapper} ${css.page}`) || css.wrapper

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="bottom"
      classes={{ root: css.drawer_root, paper: style }}
    >
      {children}
    </Drawer>
  )
}

export default Popup
