import { useQuery } from 'react-query'

import storage from '../../config/storage'
import transactionQueries from './transactions.routes'

export const cardDetailsKey = 'Fd7Hf2wuZf'

const useFetchCardDetails = () => {
  const store = storage.local

  const cardDetails = store.get(cardDetailsKey)

  return useQuery(cardDetailsKey, transactionQueries.getCardDetails, {
    select: response => {
      store.add({ key: cardDetailsKey, value: response })
      return response.data
    },
    initialData: !cardDetails ? undefined : cardDetails
  })
}

export default useFetchCardDetails
