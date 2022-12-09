const chatRoutes = {
  // GET
  conversations: '/user/chats',
  getMessages: (chatId: string) => `/user/chat/messages/${chatId}`,
  getUnreadCount: (chatId: string) => `/user/chat/messages/count/${chatId}`,
  getNewMessage: '/user/chat/new-messages',
  // POST
  openChat: (profileId: string) => `/user/chat/${profileId}`,
  sendMessage: (chatId: string) => `/user/chat/message/${chatId}`,
  readMessages: (chatId: string) => `/user/chat/messages/read/${chatId}`,
  sharePost: 'user/chat/share/message',
  //DELETE
  unsendMessage: (messageId: string) => `/user/chat/message/${messageId}`,
  clearChat: (chatId: string) => `/user/chat/${chatId}?conversationId=${chatId}`
}

export default chatRoutes
