import { Drawer } from '@mui/material'

import usePopup from '../../../hooks/popup.hook'
import NotificationList from '../../ui/notification-list'
import NotificationTitleSection from '../../ui/notification-title'
import css from './notification.module.scss'

const NotificationScreen = () => {
  const { isOpen, closePopup } = usePopup()
  const open = isOpen('activity-screen')

  return (
    <Drawer
      anchor="right"
      open={open}
      classes={{ root: css.root, paper: css.paper }}
      onClose={closePopup}
    >
      <div className={css.page}>
        <NotificationTitleSection />
        <div className={css.wrapper}>
          <NotificationList />
        </div>
      </div>
    </Drawer>
  )
}

export { NotificationScreen }
