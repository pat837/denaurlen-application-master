import Box from '@mui/material/Box'
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import useFetchUploaderStats from '../../api-routes/statsboard/fetch-uploader-stats'
import { numberFormat as format } from '../../utils'
import css from '../../styles/pages/statsboard/statsboard.module.scss'

export const CircularProgressWithLabel = (props: CircularProgressProps & { value: number }) => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <CircularProgress size={100} variant="determinate" {...props} />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant="subtitle1" component="div" color="text.primary">
        {props.value.toFixed(2)}%
      </Typography>
    </Box>
  </Box>
)

const UploaderStatsScreen = () => {
  const { data } = useFetchUploaderStats()

  return (
    <div className={css.screen_wrapper}>
      <div className={css.screen}>
        <div className={css.card}>
          <div className={css.one}>
            <span className={css.value}>{format(data?.totalValuationPosts || 0, true)}</span>
            <span className={css.label}>Posts</span>
          </div>
          <div className={css.two}>
            <span className={css.value}>{format(data?.interestingCount || 0, true)}</span>
            <span className={css.label}>Interesting</span>
          </div>
          <div className={css.three}>
            <span className={css.value}>{format(data?.infinityCount || 0, true)}</span>
            <span className={css.label}>Infinity</span>
          </div>
          <div className={css.four}>
            <CircularProgressWithLabel value={data?.registrationsRatio || 0} />
            <span className={css.label}>Participant Ratio</span>
          </div>
          <div className={css.five}>
            <span className={css.value}>{format(data?.postCoins.highestGrossWorth || 0, true)}</span>
            <span className={css.label}>HGW</span>
          </div>
          <div className={css.six}>
            <span className={css.value}>{format(data?.postCoins.highestNetWorth || 0, true)}</span>
            <span className={css.label}>HNW</span>
          </div>
        </div>
        <div className={css.others}>
          <h4>Other Activities</h4>
          <ul>
            <li>
              <ul>
                <li>
                  <span>Average Net-Worth</span>
                  <span>{format(data?.postCoins.avgNetWorth || 0, true)}</span>
                </li>
                <li>
                  <span>Total Net-Worth</span>
                  <span>{format(data?.postCoins.totalNetWorth || 0, true)}</span>
                </li>
                <li>
                  <span>Average Gross-Worth</span>
                  <span>{format(data?.postCoins.avgGrossWorth || 0, true)}</span>
                </li>
                <li>
                  <span>Total Gross-Worth</span>
                  <span>{format(data?.postCoins.totalGrossWorth || 0, true)}</span>
                </li>
              </ul>
            </li>
            <li>
              <ul>
                <li>
                  <span>Highest Gamers</span>
                  <span>{format(data?.gamers.highestGamers || 0, true)}</span>
                </li>
                <li>
                  <span>Average Gamers</span>
                  <span>{format(data?.gamers.avgGamers || 0, true)}</span>
                </li>
                <li>
                  <span>Total Gamers</span>
                  <span>{format(data?.gamers.totalGamers || 0, true)}</span>
                </li>
              </ul>
            </li>
            <li>
              <ul>
                <li>
                  <span>Highest Spectators</span>
                  <span>{format(data?.spectators.highestSpectators || 0, true)}</span>
                </li>
                <li>
                  <span>Average Spectators</span>
                  <span>{format(data?.spectators.avgSpectators || 0, true)}</span>
                </li>
                <li>
                  <span>Total Spectators</span>
                  <span>{format(data?.spectators.totalSpectators || 0, true)}</span>
                </li>
              </ul>
            </li>
            <li>
              <ul>
                <li>
                  <span>Hightest Registrations</span>
                  <span>{format(data?.registrations.highestRegistrations || 0, true)}</span>
                </li>
                <li>
                  <span>Average Registrations</span>
                  <span>{format(data?.registrations.avgRegistrations || 0, true)}</span>
                </li>
                <li>
                  <span>Total Registrations</span>
                  <span>{format(data?.registrations.totalRegistrations || 0, true)}</span>
                </li>
              </ul>
            </li>
            <li>
              <ul>
                <li>
                  <span>Highest Views</span>
                  <span>{format(data?.views.highestViews || 0, true)}</span>
                </li>
                <li>
                  <span>Average Views</span>
                  <span>{format(data?.views.avgViews || 0, true)}</span>
                </li>
                <li>
                  <span>Total Views</span>
                  <span>{format(data?.views.totalViews || 0, true)}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UploaderStatsScreen
