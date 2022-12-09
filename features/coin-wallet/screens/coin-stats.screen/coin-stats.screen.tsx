import { useSelector } from 'react-redux'

import ConditionalRender from '../../../../components/ui/conditional-render'
import BottomCoinStatsMenu from '../../components/bottom-coin-stats-menu'
import IncomeStats from '../../components/coins-stats/income-stats'
import OutgoingStats from '../../components/coins-stats/outgoing-stats'
import GraphPaletteMenu from '../../components/graph-palette-menu'
import css from './coin-stats-screen.module.scss'

import type { storeType } from '../../../../types'

const IncomeStatsScreen = () => (
  <div className={css.page}>
    <IncomeStats />
  </div>
)

const OutgoingStatsScreen = () => (
  <div className={css.page}>
    <OutgoingStats />
  </div>
)

const Screen = () => {
  const { stats } = useSelector((store: storeType) => store.coinWallet)
  return (
    <ConditionalRender condition={stats === 'INCOMING'}>
      <IncomeStatsScreen />
      <OutgoingStatsScreen />
    </ConditionalRender>
  )
}

export const CoinStatsScreen = () => {
  return (
    <>
      <Screen />
      <BottomCoinStatsMenu />
      <GraphPaletteMenu />
    </>
  )
}
