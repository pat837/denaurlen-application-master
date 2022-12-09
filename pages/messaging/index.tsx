import { Avatar, ButtonBase, Drawer, Fab, useMediaQuery, useScrollTrigger } from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useFetchConversations from '../../api-routes/messaging/fetch-conversations'
import useGetUnreadCount from '../../api-routes/messaging/unread-count'
import ChatIcon from '../../components/icons/chat.icon'
import MessagingScreen from '../../components/screens/messaging.screen/messaging.screen'
import NewMessageScreen from '../../components/screens/new-message.screen'
import { ProfileContext } from '../../contexts/profile.context'
import { messageActions } from '../../data/actions'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import useInViewport from '../../hooks/in-viewport.hook'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/messages/messages.module.scss'
import { numberFormat } from '../../utils'
import { getMediaURL } from '../../utils/get-url'

import type { storeType } from '../../types'
import type { Conversation_, ConversationMember_ } from '../../types/messaging.types'
import CoinsIcon2 from '../../components/icons/coins2.icon'

type ChatItemParams_ = {
  receiver: ConversationMember_
  chat: Conversation_
  ref: ((node: any) => void) | undefined
  yourMessage: boolean
  openChat: () => void
  earnCoins: number
}

export const ChatItem = ({ receiver, chat, ref, yourMessage, openChat, earnCoins }: ChatItemParams_) => {
  const { data } = useGetUnreadCount(chat._id)

  return (
    <ButtonBase key={chat._id} className={css.chat_card} onClick={openChat}>
      <Avatar
        className={css.avatar}
        src={!receiver.member.profilePic ? undefined : getMediaURL(receiver.member.profilePic)}
        alt={receiver.member.username}
      />
      <div className={css.preview} ref={ref}>
        <p>{receiver.member.username}</p>
        {!chat.lastMessage || (
          <span>
            {!chat.lastMessage.postId
              ? `${yourMessage ? 'You ' : ''}${!chat.lastMessage.isForwarded ? '' : 'forwarded: '} ${
                  chat.lastMessage.message
                }`
              : `${yourMessage ? 'You ' : ''}${!chat.lastMessage.isForwarded ? 'shared a' : 'forwarded'} post`}
          </span>
        )}
      </div>
      <div className={css.coins}>
        <CoinsIcon2 />
        <span>{earnCoins}</span>
      </div>
      <div className={css.time_wrapper}>
        {(data || 0) > 0 && <span>{numberFormat(data || 0, true)}</span>}
        <time>{moment(chat.updatedAt).fromNow(true)}</time>
      </div>
    </ButtonBase>
  )
}

const MessagingIndexPage = () => {
  const isLargeScreen = useMediaQuery('(min-width: 720px)')
  const { profile } = useContext(ProfileContext)
  const router = useRouter()
  const dispatch = useDispatch()
  const pageRef = useInViewport({})
  const { autoHide } = useSelector((state: storeType) => state.navbar)
  const trigger = useScrollTrigger({ target: undefined })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFetchConversations(
    pageRef.isVisible,
    20
  )

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  usePageTitle({ title: 'Messages' })

  const openPopup = () => {
    router.push({ pathname: router.pathname, query: { popup: 'friends-list' } }, undefined, {
      shallow: true
    })
  }
  const closePopup = () => router.back()

  const openChat = (chat: Conversation_) => () => {
    dispatch(messageActions.setConversation(chat))
    router.push('/messaging/chat')
  }

  if (isLargeScreen) return <MessagingScreen />

  return (
    <>
      <div className={css.page_wrapper} ref={pageRef.ref}>
        {data?.pages.map((page, pageNo) => {
          const isLastPage = (data.pages.length = pageNo + 1)

          return page.map((chat, indx) => {
            const receiver = chat.members.find(({ member }) => member._id !== profile._id)
            const earnCoins = chat.members.find(({ member }) => member._id === profile._id)?.coins ?? 0

            if (receiver === undefined) return <></>

            const ref = isLastPage && indx === 14 ? nextPageTrigger : undefined

            return (
              <ChatItem
                chat={chat}
                openChat={openChat(chat)}
                receiver={receiver}
                ref={ref}
                yourMessage={chat.lastMessage?.sender === profile._id}
                key={chat._id}
                earnCoins={earnCoins}
              />
            )
          })
        })}
        <div className={css.fab_overflow} />
      </div>
      <Fab
        className={`${css.fab} ${(trigger && autoHide) || css.show_fab}`}
        variant="circular"
        color="primary"
        aria-label="new-category"
        size="medium"
        onClick={openPopup}
      >
        <ChatIcon />
      </Fab>
      <Drawer
        anchor="bottom"
        open={router.query?.popup === 'friends-list'}
        classes={{ paper: css.paper }}
        onClose={closePopup}
      >
        <NewMessageScreen />
      </Drawer>
    </>
  )
}

MessagingIndexPage.Layout = HomeLayout

export default MessagingIndexPage
