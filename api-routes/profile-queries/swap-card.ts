import { useQuery } from 'react-query'
import queries from './profile.routes'

const key = 'swap-cards'

const useFetchSwapCard = () =>
  useQuery(key, queries.getSwapCards, {
    select: res => res.data.cards
  })

export default useFetchSwapCard
