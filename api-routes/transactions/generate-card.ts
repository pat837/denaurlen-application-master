import { useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import { cardDetailsKey } from './fetch-card-details'
import queries from './transactions.routes'

const useGenerateCard = () => {
  return useMutation(queries.verifyOTPAndGenerateCard, {
    onSuccess: (data, _variables, _context) => {
      queryClient.setQueryData(cardDetailsKey, data)
    },
    onSettled: () => queryClient.invalidateQueries(cardDetailsKey)
  })
}

export default useGenerateCard
