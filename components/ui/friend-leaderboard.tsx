import { Skeleton, useMediaQuery } from '@mui/material'
import { useCallback, useContext, useRef } from 'react'

import useGetFriendsLeaderboardWithSearch from '../../api-routes/leaderboard/useFetchFriendsLeaderboardWithFriends'
import useGetFriendsLeaderboard from '../../api-routes/leaderboard/useGetFriendsLeaderboard'
import { numberFormat } from '../../utils'
import { ProfileContext } from '../../contexts/profile.context'
import css from '../../styles/leaderboard.module.scss'
import CoinsIcon2 from '../icons/coins2.icon'
import Avatar from './avatar'
import HideOnScroll from './hide-on-scroll'
import { LeaderboardCardForDesktop, LeaderboardCardForMobile } from './leaderboard-card'

const SIZE = 20 as const

const FriendLeaderboardWithSearch = ({ search }: { search: string }) => {
  const [{ data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage }, isMobile] = [
    useGetFriendsLeaderboardWithSearch(search),
    useMediaQuery('(max-width: 980px)')
  ]

  // Pagination code
  const observer = useRef<any>()
  const lastCardRef = useCallback(
    (node: any) => {
      if (isFetching) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetching]
  )

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
          ? data.pages
              .sort((a, b) => a.rank - b.rank)
              .map(user => <LeaderboardCardForMobile key={user._id} {...user} hideIndicator />)
          : data.pages
              .sort((a, b) => a.rank - b.rank)
              .map(user => <LeaderboardCardForDesktop key={user._id} {...user} hideIndicator />)}
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

const FriendLeaderboard = ({ search }: { search: string }) => {
  const [{ data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage }, isMobile] = [
    useGetFriendsLeaderboard(SIZE),
    useMediaQuery('(max-width: 980px)')
  ]

  // Pagination code
  const observer = useRef<any>()
  const lastCardRef = useCallback(
    (node: any) => {
      if (isFetching) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetching]
  )

  if (!!search) return <FriendLeaderboardWithSearch search={search} />

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
          ? data.pages.map((user, index) => (
              <LeaderboardCardForMobile key={user._id} {...user} rank={index + 1} hideIndicator />
            ))
          : data.pages.map((user, index) => (
              <LeaderboardCardForDesktop key={user._id} {...user} rank={index + 1} hideIndicator />
            ))}
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

export default FriendLeaderboard

const OwnRank = ({ isMobile }: { isMobile: boolean }) => {
  const { profile } = useContext(ProfileContext)

  const { data, isLoading } = useGetFriendsLeaderboardWithSearch(profile.username)

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
                    <span className={css.rank_}>{user.rank}</span>
                    <div className={css.profile_}>
                      <Avatar url={user.profilePic} alt={user.name} className={css.avatar} />
                      <div className={css.info}>
                        <p>{user.username}</p>
                        <span>
                          <CoinsIcon2 />
                          {numberFormat(user.wallet)}
                        </span>
                      </div>
                    </div>
                  </div>
                </HideOnScroll>
              )
          })
        : data.pages.map(user => {
            if (user._id === profile._id)
              return (
                <div key={user._id} className={css.self_rank}>
                  <LeaderboardCardForDesktop {...user} hideIndicator />
                </div>
              )
          })}
    </>
  )
}
