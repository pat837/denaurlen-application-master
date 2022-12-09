import chatRoutes from './messaging.routes'
import http from '../../config/http'

const readMessages = (chatId: string) => http.post(chatRoutes.readMessages(chatId)).catch(() => {})

export default readMessages
