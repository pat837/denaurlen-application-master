import { ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import SwipeableViews from 'react-swipeable-views'

import { useGetFollowFollowingCounts } from '../../../api-routes/Profile'
import { numberFormat as format } from '../../../utils'
import { profilePageActions } from '../../../data/actions'
import store from '../../../data/store'
import usePopup from '../../../hooks/popup.hook'
import FollowersListScreen from '../../screens/followers-list/followers-list.screen'
import Popup from '../../ui/popup'
import css from './follower-following.module.scss'

const FollowerFollowingPopup = ({ username }: { username: string }) => {
  const { isOpen, closePopup } = usePopup()

  const dispatch = useDispatch()
  const {
    profilePage: { popup }
  } = store.getState()

  const changeHandler = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    if (value === 'followers' || value === 'following') dispatch(profilePageActions.setPopup(value))
  }
  const swipeHandler = (index: number) =>
    dispatch(profilePageActions.setPopup(index === 0 ? 'followers' : 'following'))

  const { data } = useGetFollowFollowingCounts(username)

  return (
    <Popup open={isOpen('followers-following')} onClose={closePopup}>
      <div className={css.wrapper}>
        <div className={css.container}>
          <div className={css.title_section}>
            <span className={css.count}>
              {format(data?.[popup === 'following' ? 'followingCount' : 'followersCount'] || 0, false)}
            </span>
            <span className={css.title}>{popup}</span>
          </div>
          <div className={css.nav_wrapper}>
            <div className={css.navigation_section}>
              <input
                type="radio"
                name="tab"
                id="tab-0"
                value="followers"
                checked={popup === 'followers'}
                onChange={changeHandler}
              />
              <input
                type="radio"
                name="tab"
                id="tab-1"
                value="following"
                checked={popup === 'following'}
                onChange={changeHandler}
              />
              <nav className={popup === 'followers' ? css.tab1 : css.tab2}>
                <label htmlFor="tab-0">Followers</label>
                <label htmlFor="tab-1">Following</label>
              </nav>
            </div>
          </div>
          <SwipeableViews
            style={{ minHeight: '50vh' }}
            index={popup === 'followers' ? 0 : 1}
            onChangeIndex={swipeHandler}
          >
            <FollowersListScreen username={username} />
            <FollowersListScreen username={username} />
          </SwipeableViews>
        </div>
      </div>
    </Popup>
  )
}

export default FollowerFollowingPopup
