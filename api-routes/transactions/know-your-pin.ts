import { useMutation } from 'react-query'

import TransactionRoutes from './transactions.routes'

const useKnowYourPin = () => useMutation(TransactionRoutes.knowYourPin)

export default useKnowYourPin
