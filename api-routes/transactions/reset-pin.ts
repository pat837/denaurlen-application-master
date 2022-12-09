import { useMutation } from 'react-query'
import TransactionRoutes from './transactions.routes'

const useResetPin = () => useMutation(TransactionRoutes.resetPin)

export default useResetPin
