import http from '../../config/http'
import { PlayerStatsResponse_, UploaderStatsResponse_ } from '../../types/statsboard.type'

const urls = {
  uploader: '/user/stats-board/uploader',
  player: '/user/stats-board/player'
}

const fetchUploaderStats = () => http.get<UploaderStatsResponse_>(urls.uploader)
const fetchPlayerStats = () => http.get<PlayerStatsResponse_>(urls.player)

const statsboardRoutes = { fetchUploaderStats, fetchPlayerStats }

export default statsboardRoutes
