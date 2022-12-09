import { PostUploader_ } from '.'

export type FetchConversationParams_ = {
  page: number
  size: number
  signal: AbortSignal | undefined
}

export type ConversationMember_ = {
  member: PostUploader_ & { name: string }
  messageCount: number
  coins: number
  _id: string
}

export type Conversation_ = {
  _id: string
  dp: number
  members: ConversationMember_[]
  isGroup: boolean
  admins: never[]
  createdAt: Date
  updatedAt: Date
  lastMessage?: {
    _id: string
    sender: string
    message: string
    isForwarded: false
    postId: string
  }
}

export type Message_ = {
  _id: string
  sender: string
  message: string
  createdAt: Date
  replyFor?: {
    _id: string
    message: string
    postId?: {
      src: string[]
      thumbnail?: string
    }
  }
  readBy: string[]
  isForwarded?: boolean
  postId?: {
    _id: string
    src: string[]
    thumbnail?: string
    postType: string
    uploader: {
      _id: string
      username: string
      profilePic: string
    }
  }
}

export type FetchConversation_ = {
  pages: number
  currentPage: number
  data: Conversation_[]
}

export type FetchMessagesParams_ = {
  page: number
  size: number
  chatId: string
  signal: AbortSignal | undefined
}

export type FetchMessages_ = {
  pages: number
  currentPage: number
  data: Message_[]
}

export type SendMessageParams_ = {
  chatId: string
  message: string
  replyFor?: string
}

export type GroupedMessageList = {
  [key: string]: Message_[]
}
