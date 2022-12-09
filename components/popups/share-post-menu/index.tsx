import { ButtonBase, formHelperTextClasses, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import { ChangeEventHandler, useContext, useState } from 'react'

import useFetchConversations from '../../../api-routes/messaging/fetch-conversations'
import { useSharePostToMany } from '../../../api-routes/messaging/share-post'
import { ProfileContext } from '../../../contexts/profile.context'
import useFetchNextPage from '../../../hooks/fetch-next-page.hook'
import usePopup from '../../../hooks/popup.hook'
import useSearch from '../../../hooks/search.hook'
import XFilledIcon from '../../icons/x-filled.icon'
import Avatar from '../../ui/avatar'
import Button from '../../ui/button'
import Checkbox from '../../ui/checkbox'
import ConditionalRender from '../../ui/conditional-render'
import Popup from '../../ui/popup'
import css from './share-post-menu.module.scss'

const ListItem = () => {
  return <ButtonBase></ButtonBase>
}

const SharePostMenu = () => {
  const { isOpen, closePopup } = usePopup()
  const { profile } = useContext(ProfileContext)
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useFetchConversations()
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([])
  const { mutate: sharePost, isLoading: isSharing } = useSharePostToMany()
  const router = useRouter()
  const [search, setSearch] = useState('')

  const searchInputHandler: ChangeEventHandler<HTMLInputElement> = event => {
    setSearch(event.target.value)
  }
  const clearSearch = () => setSearch('')

  const nextPageTrigger = useFetchNextPage({
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false,
    fetchNextPage
  })

  const { loading: isSearching, users } = useSearch(search, 1, 10, 2)

  const selectProfileHandler = (profileId: string) => () => {
    if (selectedProfiles.some(profile => profile === profileId))
      setSelectedProfiles(list => list.filter(l => l !== profileId))
    else setSelectedProfiles(list => [...list, profileId])
  }

  const closeHandler = () => {
    setSelectedProfiles([])
    closePopup()
  }

  const shareHandler = () => {
    if (selectProfileHandler.length === 0) return undefined

    const postId = router.query?.postId?.toString() ?? ''
    const isForward = router.query?.isForward?.toString() === 'true'
    const message = router.query?.message?.toString() ?? ''

    if (!!message)
      return sharePost(
        { usersIdList: selectedProfiles, isForwarded: isForward, message },
        {
          onSuccess: closeHandler
        }
      )

    sharePost(
      { postId, usersIdList: selectedProfiles, isForwarded: isForward },
      {
        onSuccess: closeHandler
      }
    )
  }

  return (
    <Popup open={isOpen('post-share-menu')} onClose={closeHandler}>
      <div className={css.wrapper}>
        <div className={css.search_wrapper}>
          <div className={css.input_field}>
            <input placeholder="Search..." onChange={searchInputHandler} value={search} />
            <IconButton aria-label="clear-search" onClick={clearSearch}>
              <XFilledIcon />
            </IconButton>
          </div>
        </div>
        <ConditionalRender condition={search.length > 0}>
          <ConditionalRender condition={isSearching}>
            <div className={css.loader}>
              <span>Loading...</span>
            </div>
            <div className={css.list}>
              {users.map(user => (
                <ButtonBase key={user._id} className={css.list_item} onClick={selectProfileHandler(user._id)}>
                  <div className={css.avatar_wrapper}>
                    <Avatar alt={user.profilePic} className={css.avatar} />
                    <div className={css.user_wrapper}>
                      <p>{user.username}</p>
                      <span>{user.name}</span>
                    </div>
                  </div>
                  <div style={{ pointerEvents: 'none' }}>
                    <Checkbox
                      checked={selectedProfiles.some(profile => profile === user._id)}
                      label=""
                      onChange={() => {}}
                    />
                  </div>
                </ButtonBase>
              ))}
            </div>
          </ConditionalRender>
          <ConditionalRender condition={isLoading}>
            <div className={css.loader}>
              <span>Loading....</span>
            </div>
            <div className={css.list}>
              {data?.pages.map((page, pageNo) => {
                const isLastPage = pageNo + 1 === data.pages.length

                return page.map((chat, indx) => {
                  const user = chat.members.find(({ member }) => member._id !== profile._id)?.member!

                  const ref = isLastPage && indx === 15 ? nextPageTrigger : undefined

                  return (
                    <ButtonBase key={chat._id} className={css.list_item} onClick={selectProfileHandler(user._id)}>
                      <div className={css.avatar_wrapper} ref={ref}>
                        <Avatar alt={user.profilePic} className={css.avatar} />
                        <div className={css.user_wrapper}>
                          <p>{user.username}</p>
                          <span>{user.name}</span>
                        </div>
                      </div>
                      <div style={{ pointerEvents: 'none' }}>
                        <Checkbox
                          checked={selectedProfiles.some(profile => profile === user._id)}
                          label=""
                          onChange={() => {}}
                        />
                      </div>
                    </ButtonBase>
                  )
                })
              })}
            </div>
          </ConditionalRender>
        </ConditionalRender>
        <div className={css.share_bar_fix} />
        <div className={css.share_bar}>
          <Button label="share" loading={isSharing} onClick={shareHandler} />
        </div>
      </div>
    </Popup>
  )
}

export default SharePostMenu
