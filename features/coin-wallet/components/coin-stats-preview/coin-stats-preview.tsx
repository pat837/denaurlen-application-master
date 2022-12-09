import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AddPostIcon from '../../../../components/icons/add-post.icon'
import TrashIcon from '../../../../components/icons/delete.icon'
import LikeIcon from '../../../../components/icons/like.icon'
import MoreCircleIcon from '../../../../components/icons/more-circle.icon'
import RewardIcon from '../../../../components/icons/reward.icon'
import ValuationPostIcon from '../../../../components/icons/valuationPostIcon'
import Button from '../../../../components/ui/button'
import { coinWalletActions } from '../../../../data/actions'
import useIncomeStats from '../../../../hooks/coin-stats/income-stats.hook'
import useOutgoingStats from '../../../../hooks/coin-stats/outgoing-stats.hook'
import css from './coin-stats-preview.module.scss'

import type { storeType } from '../../../../types'

type StatProps = {
  icon: ReactNode
  label: string
  value: number
  color: string
  iconColor: string
}

type StatsPreviewProps = {
  heading: string
  onViewMore: () => any
  data: Omit<StatProps, 'color' | 'iconColor'>[]
}

const Stat = ({ label, value, icon, color, iconColor }: StatProps) => (
  <li>
    <span className={`${css.icon} ${css[iconColor]}`} style={{ backgroundColor: color }}>
      {icon}
    </span>
    <div className={css.progress}>
      <span>{label}</span>
      <div className={css.progress_bar} about="rewards">
        <span className={css.bar} style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
    <span className={css.value}>{value.toFixed(2)}</span>
  </li>
)

const StatsPreview = ({ heading, onViewMore, data }: StatsPreviewProps) => {
  const { palette } = useSelector((store: storeType) => store.coinWallet)

  return (
    <div className={css.card}>
      <div className={css.header}>
        <h4>{heading}</h4>
        <span className={css.button}>
          <Button label="view more" variant="text" removePadding onClick={onViewMore} />
        </span>
      </div>
      <ul>
        {data.map((stat, indx) => {
          const ind = indx % palette.bg.length
          return <Stat key={stat.label} {...stat} color={palette.bg[ind]} iconColor={palette.text[ind]} />
        })}
      </ul>
    </div>
  )
}

const IncomeStatsPreview = () => {
  const { data } = useIncomeStats()
  const router = useRouter()
  const dispatch = useDispatch()

  const viewMoreHandler = () => {
    dispatch(coinWalletActions.changeCoinStatsTab('INCOMING'))
    router.push('/wallet/coin-analytics')
  }

  return (
    <StatsPreview
      heading="Income Stats"
      onViewMore={viewMoreHandler}
      data={[
        { icon: <RewardIcon />, label: 'Rewards', value: data?.REWARDS ?? 0 },
        { icon: <ValuationPostIcon />, label: 'Valuation', value: data?.VALUATION ?? 0 },
        { icon: <AddPostIcon />, label: 'Post uploads', value: data?.UPLOADS ?? 0 },
        { icon: <LikeIcon />, label: 'Likes & Interesting', value: data?.LIKES ?? 0 },
        { icon: <MoreCircleIcon />, label: 'Others', value: data?.OTHERS ?? 0 }
      ]}
    />
  )
}

const OutgoingStatsPreview = () => {
  const { data } = useOutgoingStats()
  const { push } = useRouter()
  const dispatch = useDispatch()

  const viewMoreHandler = () => {
    dispatch(coinWalletActions.changeCoinStatsTab('OUTGOING'))
    push('/wallet/coin-analytics')
  }

  return (
    <StatsPreview
      heading="Outgoing Stats"
      onViewMore={viewMoreHandler}
      data={[
        { value: data?.UPLOADS ?? 0, label: 'Post deletion', icon: <TrashIcon /> },
        { value: data?.VALUATION ?? 0, label: 'Valuation', icon: <ValuationPostIcon /> },
        { value: data?.LIKES ?? 0, label: 'Likes & Interests', icon: <LikeIcon /> },
        { value: data?.OTHERS ?? 0, label: 'Others', icon: <MoreCircleIcon /> }
      ]}
    />
  )
}

export { IncomeStatsPreview, OutgoingStatsPreview }
