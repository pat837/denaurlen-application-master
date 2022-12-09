import { Avatar, ButtonBase } from '@mui/material'
import { ChangeEvent, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useFetchConversations from '../../../api-routes/messaging/fetch-conversations'
import { getMediaURL } from '../../../utils/get-url'
import { ProfileContext } from '../../../contexts/profile.context'
import { messageActions } from '../../../data/actions'
import useFetchNextPage from '../../../hooks/fetch-next-page.hook'
import useMessageHandler from '../../../hooks/message-handler.hook'
import useSearch from '../../../hooks/search.hook'
import { ChatItem } from '../../../pages/messaging'
import { ChatContainer } from '../../../pages/messaging/chat'
import style from '../../../styles/pages/messages/new-message.module.scss'
import { storeType } from '../../../types'
import { Conversation_ } from '../../../types/messaging.types'
import MessageIcon from '../../icons/chat.icon'
import Button from '../../ui/button'
import ConditionalRender from '../../ui/conditional-render'
import DotLoader from '../../ui/dot-loader'
import css from './messaging.module.scss'

const MessagingScreen = () => {
  const { profile } = useContext(ProfileContext)
  const dispatch = useDispatch()
  const { conversation } = useSelector((s: storeType) => s.messagingState)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFetchConversations(true, 20)
  const messageHandler = useMessageHandler()
  const [search, setSearch] = useState('')
  const { users, loading } = useSearch(search, 1, 20, 2)

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }
  const clearSearch = () => setSearch('')
  const openChat = (chat: Conversation_) => () => dispatch(messageActions.setConversation(chat))
  const clickHandler = (profileId: string) => () => messageHandler(profileId, true)

  return (
    <div className={css.page}>
      <div className={css.wrapper}>
        <section className={css.chat_section}>
          <ConditionalRender condition={isLoading}>
            <></>
            <div className={css.list}>
              <div className={css.search_wrapper}>
                <input type="text" placeholder="Search..." value={search} onChange={searchHandler} />
                {!search.length || <Button label="cancel" square variant="text" onClick={clearSearch} />}
              </div>
              <ConditionalRender condition={!!search.length}>
                <ConditionalRender condition={loading}>
                  <div className={css.loader}>
                    <DotLoader />
                  </div>
                  <ConditionalRender condition={users.length === 0}>
                    <div className={css.loader}>
                      <p>No Profile found</p>
                    </div>
                    <div className={style.list_wrapper}>
                      {users.map((profile, index) => (
                        <ButtonBase
                          className={style.list_item}
                          key={profile._id}
                          onClick={clickHandler(profile._id)}
                        >
                          <Avatar
                            src={!profile.profilePic ? undefined : getMediaURL(profile.profilePic)}
                            alt={profile.name}
                            className={css.avatar}
                          />
                          <div className={style.name_wrapper}>
                            <p>{profile.username}</p>
                            <span>{profile.name}</span>
                          </div>
                        </ButtonBase>
                      ))}
                    </div>
                  </ConditionalRender>
                </ConditionalRender>
                <>
                  {data?.pages.map((page, pageNo) => {
                    const isLastPage = data.pages.length === pageNo + 1

                    return page.map((chat, index) => {
                      const receiver = chat.members.find(({ member }) => member._id !== profile._id)
                      const earnCoins = chat.members.find(({ member }) => member._id === profile._id)?.coins ?? 0

                      if (receiver === undefined) return <></>

                      const ref = isLastPage && index === 14 ? nextPageTrigger : undefined
                      return (
                        <ChatItem
                          earnCoins={earnCoins}
                          chat={chat}
                          openChat={openChat(chat)}
                          receiver={receiver}
                          ref={ref}
                          yourMessage={chat.lastMessage?.sender === profile._id}
                          key={chat._id}
                        />
                      )
                    })
                  })}
                </>
              </ConditionalRender>
            </div>
          </ConditionalRender>
        </section>
        <section className={css.chat_section}>
          <ConditionalRender condition={!conversation._id}>
            <div className={css.default_screen}>
              <section>
                <MessageIcon />
                <h4>Messaging</h4>
                <p>
                  Select conversation to start messaging and <wbr />
                  earn&nbsp;U-Coins
                </p>
              </section>
            </div>
            <ChatContainer />
          </ConditionalRender>
        </section>
      </div>
    </div>
  )
}

export default MessagingScreen
