import { useMutation } from 'react-query'

import transactionQueries from './transactions.routes'

const useShareCoins = () => useMutation(transactionQueries.shareCoins)

export default useShareCoins
