import { useMutation } from 'react-query'
import TransactionRoutes from './transactions.routes'

const useRequestResetPin = () => useMutation(TransactionRoutes.getResetPinOTP)

export default useRequestResetPin
