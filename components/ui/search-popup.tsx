import { ButtonBase, FormControl, IconButton, OutlinedInput } from '@mui/material'
import router from 'next/router'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import storage_ from '../../config/storage'
import { numberFormat } from '../../utils'
import { ProfileContext } from '../../contexts/profile.context'
import { appbarActions } from '../../data/actions'
import useSaveSearch from '../../hooks/save-search.hook'
import useSearch from '../../hooks/search.hook'
import css from '../../styles/search.module.scss'
import CoinsIcon2 from '../icons/coins2.icon'
import XIcon from '../icons/x.icon'
import AvatarRing from './avatar-ring'
import Button from './button'
import DialogBox from './dialog-box'
import DotLoader from './dot-loader'

import type { storeType } from '../../types'

const storage = storage_.local

const RECENT_SEARCH_KEY = 'ZM23aVZg78'

const SearchPopup = () => {
  const [state, dispatch, { profile }, saveSearch] = [
    useSelector((state: storeType) => state.appbar),
    useDispatch(),
    useContext(ProfileContext),
    useSaveSearch()
  ]

  const [{ query, pageNumber, recentSearch }, setSearch] = useState({
    query: '',
    pageNumber: 1,
    recentSearch: (storage.get(RECENT_SEARCH_KEY) || []) as any[]
  })

  const clearRecentSearch = () => setSearch(state => ({ ...state, recentSearch: [] }))

  useEffect(() => {
    storage.add({ key: RECENT_SEARCH_KEY, value: recentSearch })
  }, [recentSearch])

  const closeHandler = () => dispatch(appbarActions.closeSearch())

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearch(state => ({
      ...state,
      query: e.target.value,
      pageNumber: 1
    }))
  }

  const clickHandler = (user: any) => () => {
    saveSearch(user.username)
    router.push(`/${user.username}`)
    closeHandler()
    if (!recentSearch.find(u => u._id === user._id))
      setSearch(state => ({ ...state, recentSearch: [user, ...recentSearch] }))
  }

  const loadMore = () => {
    setSearch(cur => ({ ...cur, pageNumber: pageNumber + 1 }))
  }

  const { hasMore, loading, users } = useSearch(query, pageNumber)

  return (
    <DialogBox isOpen={state.showSearch} onClose={closeHandler}>
      <div className={css['popup-wrapper']}>
        {state.showSearch && (
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              autoFocus
              fullWidth
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search..."
              endAdornment={
                query && (
                  <IconButton
                    data-x
                    edge="end"
                    onClick={() => setSearch(state => ({ ...state, query: '', pageNumber: 1 }))}
                  >
                    <XIcon />
                  </IconButton>
                )
              }
              inputProps={{ 'aria-label': 'search' }}
            />
          </FormControl>
        )}
        <div data-search-result>
          {users.map(user => {
            if (profile._id !== user._id)
              return (
                <ButtonBase key={user._id} className={css['user-wrapper']} onClick={clickHandler(user)}>
                  <div data-profile>
                    <AvatarRing size={56} username={user.username} url={user.profilePic} />
                    <div className={css['username-wrapper']}>
                      <p>{user.username}</p>
                      <span>{user.name}</span>
                    </div>
                  </div>
                  <div data-coins>
                    <CoinsIcon2 />
                    <p>{numberFormat(user.wallet, true)}</p>
                  </div>
                </ButtonBase>
              )
          })}
          {!!query && loading && (
            <div className={css['load-more']}>
              <DotLoader />
            </div>
          )}
          {!!users.length && hasMore && (
            <div className={css['load-more']}>
              <Button label="see more" variant="text" onClick={loadMore} />
            </div>
          )}
          {recentSearch.length > 0 && (
            <>
              <div className={css.recent_search_title}>
                <h6>Recent</h6>
                <a onClick={clearRecentSearch}>clear</a>
              </div>
              {recentSearch.map(user => (
                <ButtonBase
                  key={user._id + user.username}
                  className={css['user-wrapper']}
                  onClick={clickHandler(user)}
                >
                  <div data-profile>
                    <AvatarRing size={56} username={user.username} url={user.profilePic} />
                    <div className={css['username-wrapper']}>
                      <p>{user.username}</p>
                      <span>{user.name}</span>
                    </div>
                  </div>
                  <div data-coins>
                    <CoinsIcon2 />
                    <p>{numberFormat(user.wallet, true)}</p>
                  </div>
                </ButtonBase>
              ))}
            </>
          )}
        </div>
      </div>
    </DialogBox>
  )
}

export default SearchPopup
