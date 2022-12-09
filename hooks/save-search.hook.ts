import http from '../config/http'

const useSaveSearch = () => {
  return (search: string) => {
    http.post('user/search', { searches: search }).catch(() => {})
  }
}

export default useSaveSearch
