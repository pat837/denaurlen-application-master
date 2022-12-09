import { ButtonBase } from '@mui/material'
import router from 'next/router'

import { useGetRank } from '../api-routes/Profile'
import { numberFormat } from '../utils'
import css from '../styles/profile-card.module.scss'
import BronzeCrownIcon from './icons/bronze-crown.icon'
import CrownIcon from './icons/crown.icon'
import GoldCrownIcon from './icons/golden-crown.icon'
import SilverCrownIcon from './icons/silver-crown.icon'

export const getCrown = (rank: number) => {
  switch (rank) {
    case 1:
      return <GoldCrownIcon />
    case 2:
      return <SilverCrownIcon />
    case 3:
      return <BronzeCrownIcon />
    default:
      return <CrownIcon />
  }
}

export const getClassNameForRank = (rank: number) => {
  if (rank < 20) return css.rank
  if (rank < 100) return `${css.rank} ${css.two_digits}`
  if (rank < 1000) return `${css.rank} ${css.three_digits}`
  if (rank < 10000) return `${css.rank} ${css.four_digits}`
  return `${css.rank} ${css.five_digits}`
}

const RankCard = ({ username }: { username: string }) => {
  const { data, isLoading } = useGetRank(username, true)

  const clickHandler = () => router.push('/leaderboard')

  return (
    <ButtonBase aria-label="rank" className={css['rank-card-wrapper']} onClick={clickHandler}>
      <div className={css.rank_card}>
        {getCrown(data || 0)}
        <span className={getClassNameForRank(data || 0)}>
          {isLoading ? '0' : numberFormat(data || 0)}
        </span>
        <span className={css.rank_label}>Rank</span>
      </div>
    </ButtonBase>
  )
}

export default RankCard
