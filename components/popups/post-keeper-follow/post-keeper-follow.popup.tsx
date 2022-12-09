import router from 'next/router'

import usePopup from '../../../hooks/popup.hook'
import Button from '../../ui/button'
import { FollowButton } from '../../ui/follow-buttons'
import Popup from '../../ui/popup'
import css from './post-keeper-follower.module.scss'

const PostKeeperFollowPopup = () => {
  const { isOpen, closePopup } = usePopup()
  const postKeeper = router.query

  return (
    <Popup open={isOpen('post-keeper-follow')} onClose={closePopup}>
      <div className={css.popup}>
        <div className={css.wrapper}>
          <p>
            You need to follow <b>@{postKeeper?.username || ''}</b> to value this pos, as{' '}
            <b>@{postKeeper?.username || ''}</b> is the Post Keeper
          </p>
          <div className={css.btn_wrapper}>
            <FollowButton
              userId={(postKeeper?._id as string) || ''}
              username={(postKeeper?.username as string) || ''}
            />
            <Button label="cancel" variant="text" onClick={closePopup} />
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default PostKeeperFollowPopup
