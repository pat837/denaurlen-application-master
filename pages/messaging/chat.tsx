import { ButtonBase, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material'
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react'
import moment from 'moment'
import { useRouter } from 'next/router'
import {
  ChangeEvent,
  FormEvent,
  Fragment,
  KeyboardEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { useSelector } from 'react-redux'
import { useLongPress } from 'use-long-press'

import useClearChat from '../../api-routes/messaging/delete-chat'
import useFetchMessages from '../../api-routes/messaging/fetch-chats'
import readMessages from '../../api-routes/messaging/read-messages'
import useSendMessage from '../../api-routes/messaging/send-message'
import useUnsendMessage from '../../api-routes/messaging/unsend-message'
import ChevronLeftIcon from '../../components/icons/chevron-left.icon'
import CoinsIcon2 from '../../components/icons/coins2.icon'
import ForwardedMessageIcon from '../../components/icons/forwarded-message.icon'
import InfoIcon from '../../components/icons/info.icon'
import MoreHorizontalIcon from '../../components/icons/more-horizontal.icon'
import SendMessageIcon from '../../components/icons/send-message.icon'
import ShareIcon from '../../components/icons/share.icon'
import SmileIcon from '../../components/icons/smile.icon'
import DoubleTickIcon from '../../components/icons/tick-double.icon'
import TickIcon from '../../components/icons/tick.icon'
import UserIcon from '../../components/icons/user.icon'
import XFilledIcon from '../../components/icons/x-filled.icon'
import SharePostMenu from '../../components/popups/share-post-menu'
import Avatar from '../../components/ui/avatar'
import Button from '../../components/ui/button'
import ConditionalRender from '../../components/ui/conditional-render'
import Picture from '../../components/ui/picture'
import Popup from '../../components/ui/popup'
import { ProfileContext } from '../../contexts/profile.context'
import { ThemeContext } from '../../contexts/theme.context'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import useInViewport from '../../hooks/in-viewport.hook'
import usePopup from '../../hooks/popup.hook'
import useSharePostMenu from '../../hooks/share-post-menu.hook'
import useShareOption from '../../hooks/share.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import { sleep } from '../../utils'
import css from './../../styles/pages/messages/chat.module.scss'

import type { storeType } from '../../types'
import type { Message_ } from '../../types/messaging.types'

const initialMessage: Message_ = {
  _id: '',
  createdAt: new Date(),
  message: '',
  sender: '',
  readBy: []
}

export const ChatContainer = () => {
  let datePill = ''
  const isMobile = useMediaQuery('(any-pointer: coarse)')
  const { mode } = useContext(ThemeContext)
  const emojiWrapperRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const showToast = useToastMessage()
  const { profile } = useContext(ProfileContext)
  const chatRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const conversationHeader = useInViewport({})
  const [{ currentMessage, isLongMessage, message, showEmoji, replayFor }, setState] = useState({
    currentMessage: initialMessage,
    replayFor: initialMessage,
    isLongMessage: false,
    message: '',
    showEmoji: false
  })
  const shareOption = useShareOption()
  const { conversation } = useSelector((s: storeType) => s.messagingState)
  const { isOpen, openPopup, closePopup } = usePopup()
  const [member, setMember] = useState(conversation.members.find(user => user.member._id !== profile._id))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const openInfo = () => {
    openPopup('conversation-info')
    handleClose()
  }

  const toggleEmojiHandler = () => {
    if (showEmoji && message.trim() && inputRef.current) inputRef.current.focus()
    setState(state => ({ ...state, showEmoji: !showEmoji }))
  }

  const emojiSelectHandler = (emoji: EmojiClickData, event: MouseEvent) => {
    setState(state => ({ ...state, message: message + emoji.emoji }))
  }

  const comingSoon = () => {
    if ('vibrate' in navigator) navigator?.vibrate(100)
    handleClose()
    showToast('This feature will enabled in future updates')
  }

  const forwardMenuHandler = useSharePostMenu({
    type: 'message',
    isForward: currentMessage.sender === profile._id ? currentMessage.isForwarded ?? false : true,
    message: currentMessage.message,
    postId: currentMessage.postId?._id
  })

  const forwardHandler = () => {
    forwardMenuHandler()
    setState(state => ({ ...state, currentMessage: initialMessage }))
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchMessages(
    conversation._id,
    conversationHeader.isVisible,
    20
  )

  const { mutate: clearChat } = useClearChat({
    errorCallback: error => {
      showToast(error?.response?.data?.message || 'Unable to unsend message')
    }
  })

  const shareHandler =
    ({ username, name }: { username: string; name: string }) =>
    () => {
      shareOption({
        title: `@${username} | ${name}`,
        text: `${name} profile on DENAURLEN`,
        url: `${window.location.origin}/${username}`
      })
    }

  const visitProfileHandler = () => router.replace(`/${member?.member.username}`)

  const clearChatHandler = () => {
    clearChat({ chatId: conversation._id })
    router.replace('/messaging')
    handleClose()
  }

  const bind = useLongPress(
    (e: any) => {
      const serializedMessage = e.target?.dataset?.message

      if (serializedMessage === undefined) return

      if ('vibrate' in navigator) navigator?.vibrate(100)
      setState(s => ({ ...s, currentMessage: JSON.parse(serializedMessage) as Message_ }))
    },
    { threshold: 600 }
  )

  const clearCurrentMessage = () => setState(s => ({ ...s, currentMessage: initialMessage }))

  const setReplayMessage = () => {
    setState(state => ({ ...state, replayFor: state.currentMessage, currentMessage: initialMessage }))
    inputRef.current?.focus()
  }

  const removeReplayMessage = () => setState(state => ({ ...state, replayFor: initialMessage }))

  const scrollDown = () => {
    chatRef.current?.scroll({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }

  useLayoutEffect(() => {
    setMember(conversation.members.find(user => user.member._id !== profile._id))
  }, [conversation.members, profile._id])

  useEffect(() => {
    scrollDown()
    if (!isMobile) inputRef.current?.focus()
  }, [isMobile, conversation._id])
  useEffect(() => {
    readMessages(conversation._id)
  }, [conversation._id, data])

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  const { mutate: sendMessage } = useSendMessage({ profileId: profile._id })
  const { mutate: unsendMessage } = useUnsendMessage({
    chatId: conversation._id,
    errorCallback: error => {
      showToast(error?.response?.data?.message || 'Unable to unsend message')
    }
  })

  const backHandler = () => router.back()

  const inputHandler = ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
    const isLongMessage = value.length > 75 || value.includes('\n')

    setState(state => ({
      ...state,
      message: value.length < 501 ? value : value.slice(0, 501),
      isLongMessage
    }))
  }

  const scrollToReplyMessage =
    (messageId: string): MouseEventHandler =>
    event => {
      event.stopPropagation()

      const bubble = document.getElementById(messageId)

      bubble?.scrollIntoView({ behavior: 'smooth', block: 'center' })

      bubble?.classList.add(css.get_focus)
      sleep(2100, () => {
        bubble?.classList.remove(css.get_focus)
      })
    }

  const selectMessageHandler = (message: Message_) => () => {
    if ('vibrate' in navigator) navigator?.vibrate(100)
    setState(s => ({ ...s, currentMessage: message }))
  }

  const copyMessageHandler = () => {
    clearCurrentMessage()
    navigator.clipboard.writeText(currentMessage.message)
    showToast('Message copied to clipboard')
  }

  const sendMessageHandler = (event: FormEvent) => {
    event.preventDefault()

    const text = message.trim()
    setState(state => ({ ...state, replayFor: initialMessage }))
    scrollDown()

    if (text)
      sendMessage(
        {
          chatId: conversation._id,
          message: text,
          replyFor: !replayFor._id ? undefined : replayFor._id
        },
        {
          onError: (e: any) => {
            showToast(e.response?.data?.message || 'Unable to send message')
          },
          onSuccess: () => {
            scrollDown()
          }
        }
      )

    setState(s => ({ ...s, message: '', isLongMessage: false, showEmoji: false }))
    inputRef.current?.focus()
    scrollDown()
  }

  const unsendMessageHandler = () => {
    unsendMessage({ messageId: currentMessage._id })
    clearCurrentMessage()
  }

  const keyUpHandler = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) return null

      if (formRef.current) formRef.current.requestSubmit()
    }
  }

  return (
    <div className={css.page_wrapper}>
      <header className={css.header}>
        <div className={css.conversation_info} ref={conversationHeader.ref}>
          <IconButton edge="start" aria-label="back" className={css.back_btn} onClick={backHandler}>
            <ChevronLeftIcon />
          </IconButton>
          <div role="button" aria-label="conversation-info" onClick={openInfo}>
            <Avatar url={member?.member?.profilePic} alt={member?.member.username || 'profile'} />
            <p>{member?.member.username}</p>
          </div>
        </div>
        <div className={css.options}>
          <div className={css.coins}>
            <CoinsIcon2 />
            <span>{conversation?.members?.find(m => m.member._id === profile._id)?.coins ?? 0}</span>
          </div>
          <IconButton
            id="chat-button"
            aria-controls={open ? 'chat-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreHorizontalIcon />
          </IconButton>
        </div>
        <Menu
          id="chat-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'chat-button'
          }}
        >
          <MenuItem onClick={openInfo}>Chat info</MenuItem>
          <MenuItem onClick={comingSoon}>Mute</MenuItem>
          <MenuItem onClick={clearChatHandler}>Delete Chat</MenuItem>
        </Menu>
      </header>
      <div className={`${css.loader} ${isLoading || css.hide}`}>
        <span>Fetching Conversation...</span>
      </div>
      {isLoading || (
        <div className={css.info_section}>
          {conversation.members.map(({ _id, member, messageCount }) => (
            <div key={_id}>
              <span>{profile._id === member._id ? 'You' : member.username}</span>
              <span>{messageCount}</span>
            </div>
          ))}
        </div>
      )}
      <form ref={formRef} onSubmit={sendMessageHandler} autoComplete="off" className={css.form}>
        {!replayFor._id || (
          <div className={css.reply_message_preview}>
            <div className={css.message_wrapper}>
              {!replayFor.postId ? (
                <>
                  <span className={css.sender}>
                    {replayFor.sender === profile._id
                      ? 'You'
                      : conversation.members.find(m => m.member._id === replayFor.sender)?.member.username}
                  </span>
                  <span className={css.message}>{replayFor.message?.slice(0, 100)}</span>
                </>
              ) : (
                <>
                  <Picture
                    src={replayFor.postId?.thumbnail ?? replayFor.postId?.src[0] ?? ''}
                    width="5rem"
                    height="5rem"
                    alt="post-preview"
                  />
                  <div style={{ height: 8 }} />
                </>
              )}
            </div>
            <IconButton aria-label="remove-reply" onClick={removeReplayMessage}>
              <XFilledIcon />
            </IconButton>
          </div>
        )}
        <div className={css.form_section}>
          <textarea
            autoFocus={!isMobile}
            ref={inputRef}
            placeholder="Message..."
            autoCapitalize="on"
            value={message}
            onChange={inputHandler}
            data-message={isLongMessage ? 'long' : 'short'}
            onKeyUp={isMobile ? undefined : keyUpHandler}
            onClick={() => setState(s => ({ ...s, showEmoji: false }))}
          />
          <IconButton edge="start" aria-label="emojis" onClick={toggleEmojiHandler}>
            <SmileIcon />
          </IconButton>
          <IconButton className={css.send_button} aria-label="send" type="submit">
            <SendMessageIcon />
          </IconButton>
        </div>
        <div ref={emojiWrapperRef} className={`${css.emoji_wrapper} ${showEmoji && css.show}`}>
          <EmojiPicker
            theme={Theme[mode]}
            emojiStyle={EmojiStyle.NATIVE}
            onEmojiClick={emojiSelectHandler}
            previewConfig={{ showPreview: false }}
            width={emojiWrapperRef.current?.clientWidth}
            height={360}
          />
        </div>
      </form>
      <div className={`${css.chats} ${showEmoji && css.emoji_shown}`} ref={chatRef}>
        {data?.pages.map((page, pageNo) => {
          const isLastPage = data.pages.length === pageNo + 1

          return page.map((_, index) => {
            if (pageNo === 0 && index === 0) datePill = _.date
            return (
              <Fragment key={_._id}>
                {(() => {
                  if (datePill !== _.date) {
                    let date = datePill
                    datePill = _.date
                    return <time className={css.date_pills} data-date={date} />
                  }
                  return <></>
                })()}
                <ConditionalRender condition={_.isPost}>
                  <div
                    id={_._id}
                    ref={isLastPage && index === 15 ? nextPageTrigger : undefined}
                    data-message={JSON.stringify(_)}
                    {...bind()}
                    onContextMenu={event => {
                      event.preventDefault()
                      selectMessageHandler(_)()
                    }}
                    onClick={() => router.push(`/post/${_.postId?.postType?.toLowerCase()}/${_.postId?._id}`)}
                    className={`${css.post_bubble} ${_.sender === profile._id && css.post_sender} ${
                      currentMessage._id === _._id && css.selected
                    }`}
                  >
                    <div className={css.post_bubble_header}>
                      {!_?.isForwarded || (
                        <span className={css.forwarded}>
                          <ForwardedMessageIcon />
                          Forwarded
                        </span>
                      )}
                      <div className={css.uploader}>
                        <Avatar alt={_?.postId?.uploader?.username ?? ''} url={_.postId?.uploader?.profilePic} />
                        <span>{_?.postId?.uploader?.username}</span>
                      </div>
                    </div>
                    <div className={css.post}>
                      <Picture
                        alt="post"
                        src={_.postId?.thumbnail ?? _.postId?.src[0] ?? ''}
                        aspectRatio={'8.5 / 11'}
                      />
                    </div>
                    <div className={css.post_bubble_footer}>
                      <time>
                        {moment(_.createdAt).format('hh:mm a')}
                        {_.sender === profile._id && (
                          <ConditionalRender condition={_.isSeen}>
                            <DoubleTickIcon />
                            <TickIcon />
                          </ConditionalRender>
                        )}
                      </time>
                    </div>
                  </div>
                  <p
                    id={_._id}
                    ref={isLastPage && index === 15 ? nextPageTrigger : undefined}
                    className={`${css.bubble} ${_.sender === profile._id && css.sender} ${
                      currentMessage._id === _._id && css.selected
                    }`}
                    data-message={JSON.stringify(_)}
                    {...bind()}
                    onContextMenu={event => {
                      event.preventDefault()
                      selectMessageHandler(_)()
                    }}
                  >
                    {!_?.isForwarded || (
                      <span className={css.forwarded}>
                        <ForwardedMessageIcon />
                        Forwarded
                      </span>
                    )}
                    {!_?.replyFor?.message || (
                      <span
                        className={css.reply_message}
                        role="button"
                        aria-label="to-reply-message"
                        onClick={scrollToReplyMessage(_.replyFor._id)}
                      >
                        {_.replyFor.message.slice(0, 118)}
                      </span>
                    )}
                    {!_?.replyFor?.postId || (
                      <div
                        className={css.reply_post}
                        role="button"
                        aria-label="to-reply-message"
                        onClick={scrollToReplyMessage(_.replyFor._id)}
                      >
                        <div className={css.post_preview}>
                          <Picture
                            alt="post"
                            width="5rem"
                            height="5rem"
                            src={_.replyFor.postId.thumbnail ?? _.replyFor.postId.src[0]}
                          />
                        </div>
                        <span>Post</span>
                      </div>
                    )}
                    {_.postId === null ? (
                      <span className={css.post_deleted}>Post unavailable</span>
                    ) : (
                      <span className={css.message}>{_.message}</span>
                    )}
                    <time>
                      {moment(_.createdAt).format('hh:mm a')}
                      {_.sender === profile._id && (
                        <ConditionalRender condition={_.isSeen}>
                          <DoubleTickIcon />
                          <TickIcon />
                        </ConditionalRender>
                      )}
                    </time>
                    <span className={css.time}>{moment(_.createdAt).format('hh:mm a, MMM DD YYYY')}</span>
                  </p>
                </ConditionalRender>
                {(() => {
                  if (isLastPage && page.length === index + 1)
                    return <time className={css.date_pills} data-date={_.date} />
                  return <></>
                })()}
              </Fragment>
            )
          })
        })}
        <div style={{ height: 'var(--appbar-height)' }} />
      </div>
      <div className={`${css.overlay} ${!currentMessage._id || css.show}`} onClick={clearCurrentMessage}>
        <div className={`${css.menu} ${!currentMessage._id || css.show}`} onClick={e => e.stopPropagation()}>
          <div>
            <Button label="FORWARD" variant="text" removePadding onClick={forwardHandler} />
          </div>
          <div>
            <Button label="REPLY" variant="text" removePadding onClick={setReplayMessage} />
          </div>
          {currentMessage.sender === profile._id && (
            <div>
              <Button label="UNSEND" variant="text" color="danger" removePadding onClick={unsendMessageHandler} />
            </div>
          )}
          {currentMessage.postId === undefined && (
            <div>
              <Button label="COPY" variant="text" removePadding onClick={copyMessageHandler} />
            </div>
          )}
        </div>
        <span className={css.overlay_info}>click anywhere to close</span>
      </div>
      <Popup open={isOpen('conversation-info')} onClose={closePopup}>
        <div className={css.info_wrapper}>
          <div className={css.info_container}>
            <div className={css.profile_section}>
              <Avatar url={member?.member.profilePic} alt={member?.member.username || 'profile'} />
              <p>{member?.member.username}</p>
              <span>{member?.member.name}</span>
            </div>
            <div className={css.options}>
              <ButtonBase className={css.option_button} onClick={visitProfileHandler}>
                <UserIcon />
                <span>view profile</span>
              </ButtonBase>
              <ButtonBase
                className={css.option_button}
                onClick={shareHandler({ username: member?.member.username || '', name: member?.member.name || '' })}
              >
                <ShareIcon />
                <span>share profile</span>
              </ButtonBase>
            </div>
            <div className={css.section_wrapper}>
              <h4>Messages Count</h4>
              <div className={css.section}>
                <div className={css.info_section1}>
                  {conversation.members.map(({ _id, member, messageCount }) => (
                    <div key={_id}>
                      <span>{profile._id === member._id ? 'You' : member.username}</span>
                      <span>{messageCount}</span>
                    </div>
                  ))}
                </div>
                <span className={css.info_message}>
                  <InfoIcon />
                  <span>You receive reward for every 20 messages you texted, replied, forwarded</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  )
}

const ChatPage = () => {
  const isLargeScreen = useMediaQuery('(min-width: 720px)')
  const router = useRouter()
  const { conversation } = useSelector((s: storeType) => s.messagingState)

  useLayoutEffect(() => {
    if (isLargeScreen) router.replace('/messaging')
  }, [isLargeScreen, router])

  if (!conversation._id) return <></>

  return (
    <>
      <ChatContainer />
      <SharePostMenu />
    </>
  )
}

export default ChatPage
