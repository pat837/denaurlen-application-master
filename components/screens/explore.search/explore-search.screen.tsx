import { Avatar, ButtonBase, Drawer } from '@mui/material'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'

import storage_ from '../../../config/storage'
import { getMediaURL } from '../../../utils/get-url'
import usePopup from '../../../hooks/popup.hook'
import useSaveSearch from '../../../hooks/save-search.hook'
import useSearch from '../../../hooks/search.hook'
import XFilledIcon from '../../icons/x-filled.icon'
import Button from '../../ui/button'
import DotLoader from '../../ui/dot-loader'
import css from './explore-search.module.scss'

const storage = storage_.local

const RECENT_SEARCH_KEY = 'ZM23aVZg78'

const ExploreSearchScreen = () => {
  const { isOpen, closePopup } = usePopup()
  const router = useRouter()

  const [{ query, pageNumber, recentSearch }, setSearch] = useState({
    query: '',
    pageNumber: 1,
    recentSearch: (storage.get(RECENT_SEARCH_KEY) || []) as any[]
  })

  const clearRecentSearch = () => setSearch(state => ({ ...state, recentSearch: [] }))

  useEffect(() => {
    storage.add({ key: RECENT_SEARCH_KEY, value: recentSearch })
  }, [recentSearch])

  const { hasMore, loading, users } = useSearch(query, pageNumber, 20, 2)
  const saveSearch = useSaveSearch()

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(state => ({ ...state, query: e.target.value, pageNumber: 1 }))
  }
  const clearSearch = () => setSearch(state => ({ ...state, query: '', pageNumber: 1 }))

  const clickHandler = (profile: any) => () => {
    saveSearch(profile.username)
    router.push(`/${profile.username}`)
    if (!recentSearch.some(u => u._id === profile._id))
      setSearch(state => ({ ...state, recentSearch: [profile, ...recentSearch] }))
  }

  const loadMore = () => {
    setSearch(cur => ({ ...cur, pageNumber: pageNumber + 1 }))
  }

  return (
    <Drawer
      anchor="bottom"
      open={isOpen('explore-search')}
      classes={{ paper: css.paper }}
      onClose={closePopup}
    >
      <div className={css.page_wrapper}>
        <div className={css.search_wrapper}>
          <div className={css.input_wrapper}>
            <input
              autoFocus={isOpen('explore-search')}
              placeholder="Search..."
              value={query}
              onChange={inputHandler}
            />
            <div className={`${css.clear_wrapper} ${!query || css.show}`} onClick={clearSearch}>
              <XFilledIcon />
            </div>
          </div>
        </div>
        {!!query && loading && (
          <div className={css.loader}>
            <DotLoader />
          </div>
        )}
        <div className={css.list_wrapper}>
          {users.map((profile, index) => (
            <ButtonBase className={css.list_item} key={profile._id} onClick={clickHandler(profile)}>
              <Avatar
                src={!profile.profilePic ? undefined : getMediaURL(profile.profilePic)}
                alt={profile.name}
                className={css.avatar}
              />
              <div className={css.name_wrapper}>
                <p>{profile.username}</p>
                <span>{profile.name}</span>
              </div>
            </ButtonBase>
          ))}
          {hasMore && <Button label="load more" variant="text" onClick={loadMore} />}
          {recentSearch.length > 0 && (
            <>
              <div className={css.recent_search_title}>
                <h6>Recent</h6>
                <a onClick={clearRecentSearch}>clear</a>
              </div>
              {recentSearch.map(profile => (
                <ButtonBase className={css.list_item} key={profile._id} onClick={clickHandler(profile)}>
                  <Avatar
                    src={!profile.profilePic ? undefined : getMediaURL(profile.profilePic)}
                    alt={profile.name}
                    className={css.avatar}
                  />
                  <div className={css.name_wrapper}>
                    <p>{profile.username}</p>
                    <span>{profile.name}</span>
                  </div>
                </ButtonBase>
              ))}
            </>
          )}
        </div>
      </div>
    </Drawer>
  )
}

export default ExploreSearchScreen
