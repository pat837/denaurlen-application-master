import {
  Autocomplete,
  Box,
  FormControl,
  IconButton,
  OutlinedInput,
  TextField,
  TextFieldProps,
  useMediaQuery
} from '@mui/material'
import { ChangeEvent, SyntheticEvent, useContext, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import XIcon from '../components/icons/x.icon'
import CountryLeaderboard from '../components/ui/country-leaderboard'
import FriendLeaderboard from '../components/ui/friend-leaderboard'
import GlobalLeaderboard from '../components/ui/global-leaderboard'
import HideOnScroll from '../components/ui/hide-on-scroll'
import Image from '../components/ui/picture'
import countries, { Country_ } from '../config/countries'
import { ProfileContext } from '../contexts/profile.context'
import { leaderboardActions } from '../data/actions'
import usePageTitle from '../hooks/page-title.hook'
import HomeLayout from '../layouts/home.layout'
import css from '../styles/leaderboard.module.scss'
import { LeaderboardType_ as LeaderboardTab_, storeType } from '../types'

const Leaderboard = () => {
  const [dispatch, isMobile, { profile }] = [
    useDispatch(),
    useMediaQuery('(max-width: 980px)'),
    useContext(ProfileContext)
  ]

  usePageTitle({ title: 'Leaderboard' })

  const { tab } = useSelector((state: storeType) => state.leaderboard)

  const changeHandler = (tab: LeaderboardTab_) => () => {
    dispatch(leaderboardActions.changeTab(tab))
    setUser('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const [user, setUser] = useState('')
  const [currentCountry, setCountry] = useState(
    countries.find(country => country.code.toLowerCase() === profile.countryCode.toLowerCase())
  )

  useLayoutEffect(() => {
    setCountry(countries.find(country => country.code.toLowerCase() === profile.countryCode.toLowerCase()))
  }, [profile.countryCode])

  const onSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUser(e.target.value)
  }

  const leaderboardList = {
    global: <GlobalLeaderboard search={user} />,
    friends: <FriendLeaderboard search={user} />,
    country: <CountryLeaderboard search={user} countryCode={currentCountry?.code || profile.countryCode} />
  }

  return (
    <div className={css.wrapper}>
      <HideOnScroll>
        <div className={css.navigation_wrapper}>
          <div style={{ height: 'var(--appbar-height)' }} />
          <div className={css.navigation_section}>
            <input
              type="radio"
              name="tab"
              id="tab-0"
              value="global"
              checked={tab === 'global'}
              onChange={changeHandler('global')}
            />
            <input
              type="radio"
              name="tab"
              id="tab-1"
              value="country"
              checked={tab === 'country'}
              onChange={changeHandler('country')}
            />
            <input
              type="radio"
              name="tab"
              id="tab-2"
              value="friends"
              checked={tab === 'friends'}
              onChange={changeHandler('friends')}
            />
            <nav className={tab === 'global' ? css.tab1 : tab === 'country' ? css.tab2 : css.tab3}>
              <label htmlFor="tab-0">Global</label>
              <label htmlFor="tab-1">Country</label>
              <label htmlFor="tab-2">Friends</label>
            </nav>
          </div>
        </div>
      </HideOnScroll>
      <div className={css.header}>
        <div className={css.input_grp}>
          {tab === 'country' && (
            <Autocomplete
              fullWidth
              id="country"
              options={countries}
              autoHighlight
              getOptionLabel={(option: { label: any }) => option.label}
              renderOption={(props, option: { code: string; label: any; phone: any }) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <Image
                    src={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png`}
                    alt={'country'}
                    isSrcAbsolute
                    width="50px"
                    aspectRatio="4.5 / 3"
                  />
                  &nbsp;&nbsp;&nbsp;
                  {option.label}
                </Box>
              )}
              value={currentCountry}
              onChange={(event: SyntheticEvent<Element, Event>, value: Country_ | null) => {
                if (value !== null) setCountry(value)
              }}
              renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                <TextField
                  {...params}
                  label="Choose a country"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password' // disable autocomplete and autofill
                  }}
                  size={isMobile ? 'small' : 'medium'}
                />
              )}
            />
          )}
          {tab === 'friends' || (
            <FormControl fullWidth variant="outlined">
              <OutlinedInput
                fullWidth
                type="text"
                value={user}
                size={isMobile ? 'small' : 'medium'}
                onChange={onSearch}
                placeholder="Search..."
                endAdornment={
                  !!user && (
                    <IconButton data-x edge="end" onClick={() => setUser('')}>
                      <XIcon width={isMobile ? 18 : 24} />
                    </IconButton>
                  )
                }
                inputProps={{ 'aria-label': 'search' }}
              />
            </FormControl>
          )}
        </div>
      </div>
      {leaderboardList[tab]}
    </div>
  )
}

Leaderboard.Layout = HomeLayout

export default Leaderboard
