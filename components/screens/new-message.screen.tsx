import { Avatar, ButtonBase } from '@mui/material'
import { ChangeEvent, useContext, useState } from 'react'

import { useGetFollowingList } from '../../api-routes/Profile'
import { getMediaURL } from '../../utils/get-url'
import { ProfileContext } from '../../contexts/profile.context'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import useMessageHandler from '../../hooks/message-handler.hook'
import useSearch from '../../hooks/search.hook'
import css from '../../styles/pages/messages/new-message.module.scss'
import XFilledIcon from '../icons/x-filled.icon'
import DotLoader from '../ui/dot-loader'

const NewMessageScreen = () => {
  const { profile } = useContext(ProfileContext)

  const messageHandler = useMessageHandler()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetFollowingList({
    username: profile.username,
    size: 20
  })

  const [search, setSearch] = useState('')
  const { users, loading } = useSearch(search, 1, 20, 2)

  const fetchNextPageRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value as string)
  const clearSearch = () => setSearch('')

  const clickHandler = (profileId: string) => () => messageHandler(profileId, true)

  return (
    <div className={css.page_wrapper}>
      <div className={css.search_wrapper}>
        <div className={css.input_wrapper}>
          <input placeholder="Search..." value={search} onChange={inputHandler} />
          <div className={`${css.clear_wrapper} ${!search || css.show}`} onClick={clearSearch}>
            <XFilledIcon />
          </div>
        </div>
      </div>
      {!!search && loading && (
        <div className={css.loader}>
          <DotLoader />
        </div>
      )}
      <div className={css.list_wrapper}>
        {(users?.length > 0 ? users : data?.pages || []).map((profile, index) => (
          <ButtonBase className={css.list_item} key={profile._id} onClick={clickHandler(profile._id)}>
            <Avatar
              src={!profile.profilePic ? undefined : getMediaURL(profile.profilePic)}
              alt={profile.name}
              className={css.avatar}
            />
            <div
              className={css.name_wrapper}
              ref={index === (data?.pages.length || 0) - 6 ? fetchNextPageRef : undefined}
            >
              <p>{profile.username}</p>
              <span>{profile.name}</span>
            </div>
          </ButtonBase>
        ))}
      </div>
    </div>
  )
}

export default NewMessageScreen
