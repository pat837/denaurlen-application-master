import { useMutation } from 'react-query'

import TransactionRoutes from './transactions.routes'

const useUpdatePin = () => useMutation(TransactionRoutes.updatePin)

export default useUpdatePin
