import router from 'next/router'

import useGetReferralCount from '../../../api-routes/settings/get-referral-count'
import useGetReferralList from '../../../api-routes/settings/get-referral-list'
import Avatar from '../../ui/avatar'
import css from './referral-code.module.scss'

const ReferralList = () => {
  const { data: count } = useGetReferralCount()
  const { data: list } = useGetReferralList()

  const clickHandler = (username: string) => () => router.push(`/${username}`)

  return (
    <div className={css.list_wrapper}>
      <div className={css.headline}>
        <h5>Referred Profiles</h5>
        <span>{count}</span>
      </div>
      {list?.map(profile => (
        <div
          key={profile._id}
          className={css.list_item}
          role="button"
          onClick={clickHandler(profile.username)}
        >
          <Avatar alt={profile.username} url={profile.profilePic} />
          <div className={css.profile}>
            <p>{profile.username}</p>
            <span>{profile.name}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReferralList
