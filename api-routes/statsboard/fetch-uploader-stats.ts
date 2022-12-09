import { useQuery } from 'react-query'

import statsboardRoutes from './statsboard.routes'

export const uploaderStatsKey = 'uploader-stats'

const useFetchUploaderStats = () =>
  useQuery(uploaderStatsKey, statsboardRoutes.fetchUploaderStats, {
    select: response => response.data
  })

export default useFetchUploaderStats
