import { Drawer, IconButton } from '@mui/material'
import { ReactNode } from 'react'

import css from '../../styles/likes-comments-drawer.module.scss'
import XIcon from '../icons/x.icon'

type LikeCommentDrawerProps = {
  open: boolean
  onClose: () => void
  title: ReactNode | string
  children: ReactNode
}

const LikeCommentDrawer = ({ open, onClose, title, children }: LikeCommentDrawerProps) => {
  return (
    <Drawer
      variant="temporary"
      anchor="bottom"
      open={open}
      onClose={onClose}
      classes={{ paper: css.drawer, root: css.root }}
    >
      <div className={css.wrapper}>
        <span className={css.dragger} />
        <div className={css.container}>{children}</div>
        <div className={css['appbar-fix']} />
        <div className={css.appbar}>
          <h6 data-title>{title}</h6>
          <IconButton edge="end" onClick={onClose}>
            <XIcon />
          </IconButton>
        </div>
      </div>
    </Drawer>
  )
}

export default LikeCommentDrawer
