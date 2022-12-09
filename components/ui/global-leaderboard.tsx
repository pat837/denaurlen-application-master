import css from '../../styles/leaderboard.module.scss'

import { Skeleton, useMediaQuery } from '@mui/material'
import { useContext } from 'react'

import useGetGlobalLeaderboard from '../../api-routes/leaderboard/useGetLeaderboard'
import useGetGlobalLeaderboardWithSearch from '../../api-routes/leaderboard/useGetLeaderboardWithSearch'
import { ProfileContext } from '../../contexts/profile.context'
import {
  LeaderboardCardForMobile,
  LeaderboardCardForDesktop,
  getIndicator,
  getCrown
} from './leaderboard-card'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import HideOnScroll from './hide-on-scroll'
import Avatar from './avatar'
import CoinsIcon2 from '../icons/coins2.icon'
import { numberFormat } from '../../utils'
import Picture from './picture'

const GlobalLeaderboardWithSearch = ({ search }: { search: string }) => {
  const [{ data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage }, isMobile] = [
    useGetGlobalLeaderboardWithSearch(search),
    useMediaQuery('(max-width: 980px)')
  ]

  const lastCardRef = useFetchNextPage({
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false,
    fetchNextPage
  })

  return (
    <>
      <ul>
        {isLoading
          ? Array.from(Array(10).keys()).map(_in => (
              <Skeleton
                key={`leaderboard-loader-${_in}`}
                variant="rectangular"
                width="100%"
                height={80}
                animation="wave"
                sx={{ borderRadius: '10px' }}
              />
            ))
          : isMobile
          ? data?.pages.map(user => <LeaderboardCardForMobile key={user._id} {...user} />)
          : data?.pages.map(user => <LeaderboardCardForDesktop key={user._id} {...user} />)}
        {data?.pages.length === 0 && (
          <div className={css.not_found}>
            <span>No user found</span>
          </div>
        )}
        {isFetchingNextPage &&
          hasNextPage &&
          Array.from(Array(2).keys()).map(_in => (
            <Skeleton
              key={`leaderboard-fetch-indicator-${_in}`}
              variant="rectangular"
              width="100%"
              height={80}
              animation="wave"
              sx={{ borderRadius: '10px' }}
            />
          ))}
      </ul>
      <span ref={lastCardRef} />
    </>
  )
}

const GlobalLeaderboard = ({ search }: { search: string }) => {
  const [{ data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage }, isMobile] = [
    useGetGlobalLeaderboard(),
    useMediaQuery('(max-width: 980px)')
  ]

  const lastCardRef = useFetchNextPage({
    fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false
  })

  if (!!search) return <GlobalLeaderboardWithSearch search={search} />

  return (
    <>
      <ul>
        {isLoading || data === undefined
          ? Array.from(Array(10).keys()).map(_in => (
              <Skeleton
                key={`leaderboard-loader-${_in}`}
                variant="rectangular"
                width="100%"
                height={80}
                animation="wave"
                sx={{ borderRadius: '10px' }}
              />
            ))
          : isMobile
          ? data.pages.map(user => <LeaderboardCardForMobile key={user._id} {...user} />)
          : data.pages.map(user => <LeaderboardCardForDesktop key={user._id} {...user} />)}
        {(data?.pages.length || 0) > 10 && <OwnRank isMobile={isMobile} />}
        {isFetchingNextPage &&
          hasNextPage &&
          Array.from(Array(2).keys()).map(_in => (
            <Skeleton
              key={`leaderboard-fetch-indicator-${_in}`}
              variant="rectangular"
              width="100%"
              height={80}
              animation="wave"
              sx={{ borderRadius: '10px' }}
            />
          ))}
      </ul>
      <span ref={lastCardRef} />
    </>
  )
}

export default GlobalLeaderboard

const OwnRank = ({ isMobile }: { isMobile: boolean }) => {
  const { profile } = useContext(ProfileContext)

  const { data, isLoading } = useGetGlobalLeaderboardWithSearch(profile.username)

  if (isLoading || !data?.pages)
    return (
      <div style={{ position: 'sticky', bottom: 0, zIndex: 999 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={80}
          animation="wave"
          sx={{ borderRadius: '10px' }}
        />
      </div>
    )
  return (
    <>
      {isMobile
        ? data.pages.map(user => {
            if (user._id === profile._id)
              return (
                <HideOnScroll direction="up">
                  <div className={css.self_rank_}>
                    <span className={css.rank_}>{getCrown(user.rank)}</span>
                    <div className={css.profile_}>
                      <div className={css.avatar_wrapper}>
                        <Avatar url={user.profilePic} alt={user.name} className={css.avatar} />
                        <div data-country-flag style={{ borderRadius: '50%', overflow: 'hidden' }}>
                          <Picture
                            src={`https://flagcdn.com/w80/${(
                              user.countryCode || 'in'
                            ).toLowerCase()}.png`}
                            alt={user.country}
                            isSrcAbsolute
                            width="22px"
                            aspectRatio="1"
                          />
                        </div>
                      </div>
                      <div className={css.info}>
                        <p>{user.username}</p>
                        <span>
                          <CoinsIcon2 />
                          {numberFormat(user.wallet)}
                        </span>
                      </div>
                    </div>
                    <div className={css.indicator_}>
                      {getIndicator({ previousRank: user.previousRank, rank: user.rank })}
                    </div>
                  </div>
                </HideOnScroll>
              )
          })
        : data.pages.map(user => {
            if (user._id === profile._id)
              return (
                <div key={user._id} className={css.self_rank}>
                  <LeaderboardCardForDesktop {...user} />
                </div>
              )
          })}
    </>
  )
}
