import { Skeleton, useMediaQuery } from '@mui/material'
import { useContext } from 'react'

import useGetCountryLeaderboard, {
  useGetCountryLeaderboardWithSearch
} from '../../api-routes/leaderboard/useGetCountryLeaderboard'
import { numberFormat } from '../../utils'
import { ProfileContext } from '../../contexts/profile.context'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import css from '../../styles/leaderboard.module.scss'
import CoinsIcon2 from '../icons/coins2.icon'
import Avatar from './avatar'
import HideOnScroll from './hide-on-scroll'
import { getCrown, LeaderboardCardForDesktop, LeaderboardCardForMobile } from './leaderboard-card'
import Picture from './picture'

const CountryLeaderboardWithSearch = ({
  search,
  countryCode
}: {
  search: string
  countryCode: string
}) => {
  const [{ data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage }, isMobile] = [
    useGetCountryLeaderboardWithSearch(countryCode, search),
    useMediaQuery('(max-width: 980px)')
  ]

  const lastCardRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

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

const CountryLeaderboard = ({ search, countryCode }: { search: string; countryCode: string }) => {
  const [{ data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage }, isMobile] = [
    useGetCountryLeaderboard(countryCode),
    useMediaQuery('(max-width: 980px)')
  ]

  const lastCardRef = useFetchNextPage({
    fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false
  })

  if (!!search) return <CountryLeaderboardWithSearch countryCode={countryCode} search={search} />

  return (
    <>
      <ul style={{ position: 'relative' }}>
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
          ? data?.pages.map(user => <LeaderboardCardForMobile key={user._id} {...user} hideIndicator />)
          : data?.pages.map(user => <LeaderboardCardForDesktop key={user._id} {...user} hideIndicator />)}
        {(data?.pages.length || 0) > 10 && <OwnRank isMobile={isMobile} countryCode={countryCode} />}
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

export default CountryLeaderboard

const OwnRank = ({ countryCode, isMobile }: { countryCode: string; isMobile: boolean }) => {
  const { profile } = useContext(ProfileContext)

  const { data, isLoading } = useGetCountryLeaderboardWithSearch(profile.countryCode, profile.username)

  if (profile.countryCode.toLowerCase() === countryCode.toLowerCase()) {
    if (isLoading || !data?.pages)
      return (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={80}
          animation="wave"
          sx={{ borderRadius: '10px' }}
        />
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

  return <></>
}
