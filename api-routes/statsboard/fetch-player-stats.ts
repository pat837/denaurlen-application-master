import { useQuery } from 'react-query'

import statsboardRoutes from './statsboard.routes'

export const playerStatsKey = 'player-stats'

const useFetchPlayerStats = () =>
  useQuery(playerStatsKey, statsboardRoutes.fetchPlayerStats, {
    select: response => response.data
  })

export default useFetchPlayerStats
