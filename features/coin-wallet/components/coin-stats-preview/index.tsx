import css from './coin-stats-preview.module.scss'
import { IncomeStatsPreview, OutgoingStatsPreview } from './coin-stats-preview'

const CoinStatsPreview = () => {
  return (
    <div className={css.coin_stats_preview_wrapper}>
      <IncomeStatsPreview />
      <OutgoingStatsPreview />
    </div>
  )
}

export default CoinStatsPreview
