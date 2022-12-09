import CoinStatsScreen from '../../features/coin-wallet/screens/coin-stats.screen'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'

const CoinAnalyticsPage = () => {
  usePageTitle({ title: 'Coin Analytics' })
  return <CoinStatsScreen />
}

CoinAnalyticsPage.Layout = HomeLayout

export default CoinAnalyticsPage
