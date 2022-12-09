import { useRouter } from 'next/router'

import useLogout from '../../hooks/logout.hook'
import css from '../../styles/components/ui/logout.popup.module.scss'
import Button from './button'
import Popup from './popup'

const LogoutPopup = () => {
  const router = useRouter()

  const { handleLogout, isLoggingOut } = useLogout()

  const closeHandler = () => router.back()

  return (
    <Popup open={router.query?.popup === 'logout'} onClose={closeHandler}>
      <div className={css.popup}>
        <div className={css.wrapper}>
          <h3>Are you sure, want to logout?</h3>
          <div>
            <Button
              label="logout"
              color="danger"
              variant="outline"
              onClick={handleLogout}
              loading={isLoggingOut}
            />
            <Button label="cancel" variant="contained" onClick={closeHandler} />
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default LogoutPopup
