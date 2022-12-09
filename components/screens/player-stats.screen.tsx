import { useRouter } from 'next/router'

import useFetchPlayerStats from '../../api-routes/statsboard/fetch-player-stats'
import { numberFormat as format } from '../../utils'
import css from '../../styles/pages/statsboard/statsboard.module.scss'
import Button from '../ui/button'
import { CircularProgressWithLabel } from './uploader-stats.screen'

const PlayerStatsScreen = () => {
  const { data } = useFetchPlayerStats()
  const router = useRouter()

  const gotoCareerResult = () => router.push('/wallet/blocked-coins')

  return (
    <div className={css.screen_wrapper}>
      <div className={css.screen}>
        <div className={css.card}>
          <div className={css.one}>
            <span className={css.value}>{format(data?.gamesRegistered || 0, true)}</span>
            <span className={css.label}>GR</span>
          </div>
          <div className={css.two}>
            <span className={css.value}>{format(data?.gamesPlayed || 0, true)}</span>
            <span className={css.label}>GP</span>
          </div>
          <div className={css.three}>
            <span className={css.value}>{format(data?.gamesWon || 0, true)}</span>
            <span className={css.label}>GW</span>
          </div>
          <div className={css.four}>
            <CircularProgressWithLabel value={data?.winRatio || 0} />
            <span className={css.label}>Win Ratio</span>
          </div>
          <div className={css.five}>
            <span className={css.value}>{format(data?.spentData.highestSpentCoins || 0, true)}</span>
            <span className={css.label}>HV</span>
          </div>
          <div className={css.six}>
            <span className={css.value}>{format(data?.infinityCount || 0, true)}</span>
            <span className={css.label}>Infinity</span>
          </div>
        </div>
        <div className={css.others}>
          <h4>Other Activities</h4>
          <ul>
            <li>
              <ul>
                <li>
                  <span>Highest spent coins</span>
                  <span>{format(data?.spentData.highestSpentCoins || 0, true)}</span>
                </li>
                <li>
                  <span>Average spend coins</span>
                  <span>{format(data?.spentData.avgSpentCoins || 0, true)}</span>
                </li>
                <li>
                  <span>Total spend coins</span>
                  <span>{format(data?.spentData.totalSpentCoins || 0, true)}</span>
                </li>
              </ul>
            </li>
            <li>
              <ul>
                <li>
                  <span>Highest Lead + 100 clicks</span>
                  <span>{format(data?.leadData.highestLeadClicks || 0, true)}</span>
                </li>
                <li>
                  <span>Average Lead + 100 Clicks</span>
                  <span>{format(data?.leadData.avgLeadClicks || 0, true)}</span>
                </li>
                <li>
                  <span>Total Lead + 100 clicks</span>
                  <span>{format(data?.leadData.totalLeadClicks || 0, true)}</span>
                </li>
              </ul>
            </li>
          </ul>
          <div className={css.button}>
            <Button onClick={gotoCareerResult} label="career results" variant="outline" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerStatsScreen
