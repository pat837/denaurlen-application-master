import { MessagingState_, reducerActionType } from '../../types'
import { Conversation_ } from '../../types/messaging.types'
import { messagingActionsType as actionType } from '../actions/action-types'

const initialConversation: Conversation_ = {
  _id: '',
  admins: [],
  createdAt: new Date(),
  dp: 0,
  isGroup: false,
  members: [],
  updatedAt: new Date()
}

const initialState: MessagingState_ = {
  conversation: initialConversation
} as const

const messageReducer = (
  state = initialState,
  { payload, type }: reducerActionType
): MessagingState_ => {
  switch (type) {
    case actionType.setConversation:
      return { ...state, conversation: payload }

    case actionType.clearConversation:
      return { ...state, conversation: initialConversation }

    default:
      return state
  }
}

export default messageReducer
