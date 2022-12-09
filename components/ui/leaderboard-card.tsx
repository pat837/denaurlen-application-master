import router from 'next/router'

import { numberFormat } from '../../utils'
import css from '../../styles/leaderboard.module.scss'
import { LeaderboardCardProps } from '../../types'
import BronzeCrownIcon from '../icons/bronze-crown.icon'
import CoinsIcon from '../icons/coins2.icon'
import GoldCrownIcon from '../icons/golden-crown.icon'
import NegativeIndicator from '../icons/negative.indicator'
import NeutralIndicator from '../icons/neutral.indicator'
import NewEntryIndicator from '../icons/new-entry.indicator'
import PositiveIndicator from '../icons/positive.indicator'
import RefreshIndicator from '../icons/refresh.indicator'
import SilverCrownIcon from '../icons/silver-crown.icon'
import AvatarRing from './avatar-ring'
import Image from './picture'

type LeaderboardCard_ = LeaderboardCardProps & { hideIndicator?: boolean }

export const getIndicator = ({ previousRank, rank }: { previousRank: number; rank: number }) => {
  if (!previousRank) return <NewEntryIndicator />
  if (previousRank > rank)
    return (
      <>
        <PositiveIndicator />
        <span style={{ color: '#26DE81' }}>{previousRank - rank}</span>
      </>
    )
  if (previousRank < rank)
    return (
      <>
        <NegativeIndicator />
        <span style={{ color: '#E74C3C' }}>{-1 * (previousRank - rank)}</span>
      </>
    )
  if (previousRank === rank) return <NeutralIndicator />
  return <RefreshIndicator />
}

const getAvatarSize = (rank: number) => {
  if (rank == 1) return 68
  if (rank == 2) return 62
  if (rank == 3) return 58
  return 60
}

export const getCrown = (rank: number) => {
  switch (rank) {
    case 1:
      return (
        <div data-crown>
          <GoldCrownIcon />
        </div>
      )
    case 2:
      return (
        <div data-crown>
          <SilverCrownIcon />
        </div>
      )
    case 3:
      return (
        <div data-crown>
          <BronzeCrownIcon />
        </div>
      )
    default:
      return <span data-rank>{rank}</span>
  }
}

export const LeaderboardCardForDesktop = ({
  _id,
  username,
  rank,
  profilePic,
  name,
  wallet,
  previousRank,
  countryCode,
  country,
  hideIndicator = false
}: LeaderboardCard_) => (
  <li key={_id} className={hideIndicator ? css.hide_rank : ''}>
    {getCrown(rank)}
    <div data-flag>
      <Image
        src={`https://flagcdn.com/w2560/${(countryCode || 'in').toLowerCase()}.png`}
        alt={country}
        isSrcAbsolute
        width="50px"
        aspectRatio="4.5 / 3"
      />
    </div>
    <div onClick={() => router.push(`/${username}`)} className={css.profile_wrapper}>
      <AvatarRing size={getAvatarSize(rank)} username={username} url={profilePic} disableClick />
      <div>
        <p data-username>{username}</p>
        <span data-name>{name || username}</span>
      </div>
    </div>
    <div className={css.coins_wrapper}>
      <CoinsIcon />
      <span data-coins>{numberFormat(wallet)}</span>
    </div>
    {hideIndicator || <span data-indicator>{getIndicator({ previousRank, rank })}</span>}
  </li>
)

export const LeaderboardCardForMobile = ({
  username,
  rank,
  profilePic,
  wallet,
  previousRank,
  countryCode,
  country,
  hideIndicator = false
}: LeaderboardCard_) => (
  <li className={`${css.card_wrapper} ${hideIndicator ? css.hide_rank : ''}`}>
    <div className={css.card}>
      {getCrown(rank)}
      <div onClick={() => router.push(`/${username}`)} className={css.profile}>
        <div data-profile-pic>
          <AvatarRing size={getAvatarSize(rank) - 8} username={username} url={profilePic} disableClick />
          <div data-country-flag style={{ borderRadius: '50%', overflow: 'hidden' }}>
            <Image
              src={`https://flagcdn.com/w80/${(countryCode || 'in').toLowerCase()}.png`}
              alt={country}
              isSrcAbsolute
              width="24px"
              aspectRatio="1"
            />
          </div>
        </div>
        <div>
          <span>{username}</span>
          <p data-coins>
            <CoinsIcon />
            {numberFormat(wallet)}
          </p>
        </div>
      </div>
      {hideIndicator || <span data-indicator>{getIndicator({ previousRank, rank })}</span>}
    </div>
  </li>
)
