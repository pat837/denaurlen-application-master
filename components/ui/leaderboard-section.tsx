import { useRouter } from 'next/router'

import useGetGlobalLeaderboard from '../../api-routes/leaderboard/useGetLeaderboard'
import css from '../../styles/components/ui/leader-section.module.scss'
import Button from './button'
import { LeaderboardCardForMobile } from './leaderboard-card'

const LeaderboardSection = () => {
  const { data } = useGetGlobalLeaderboard()
  const router = useRouter()

  return (
    <div className={css.wrapper}>
      <h5>Leaderboard</h5>
      <ul>
        {data?.pages?.slice(0, 5)?.map(user => (
          <LeaderboardCardForMobile key={user._id} {...user} />
        ))}
      </ul>
      <div className={css.btn_wrapper}>
        <Button
          label="view more"
          variant="text"
          removePadding
          onClick={() => router.push('/leaderboard')}
        />
      </div>
    </div>
  )
}

export default LeaderboardSection
