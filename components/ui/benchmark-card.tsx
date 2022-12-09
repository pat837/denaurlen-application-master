import { ButtonBase } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import useGetCurrentLead from '../../api-routes/posts/valuation/get-current-lead'
import { ProfileContext } from '../../contexts/profile.context'
import useInViewport from '../../hooks/in-viewport.hook'
import css from '../../styles/components/ui/benchmark-card.module.scss'
import { numberFormat } from '../../utils'
import { getBaseURL } from '../../utils/get-url'
import CoinsIcon2 from '../icons/coins2.icon'
import Avatar from './avatar'
import Image from './picture'
import Username from './username'

import type { PostUploader_ } from '../../types'
import type { ValuationPostStatus_ } from '../../types/valuation-post.type'

type BenchmarkCardProps_ = {
  src: string
  postId: string
  rank: number
  grossWorth: number
  status: ValuationPostStatus_
  postKeeper: PostUploader_
  uploader: PostUploader_
}

type FirstBenchmarkCardProps_ = BenchmarkCardProps_ & {
  highestValuer: string
  netWorth: number
}

const showStatusList: readonly ValuationPostStatus_[] = ['ACTIVE', 'DECLARED', 'VALUED']

export const FirstBenchmarkCard = ({
  src,
  grossWorth,
  highestValuer,
  netWorth,
  rank,
  postId,
  status,
  uploader,
  postKeeper
}: FirstBenchmarkCardProps_) => {
  const router = useRouter()
  const API_URL = getBaseURL()
  const { profile } = useContext(ProfileContext)

  const clickHandler = () => router.push('/benchmarks/posts')

  const trigger = useInViewport({})

  const { data } = useGetCurrentLead({ postId, status, watch: trigger.isVisible })

  const style = `${css.info} ${
    showStatusList.some(s => s === (data?.status || status)) ||
    profile._id === uploader._id ||
    profile._id === postKeeper._id ||
    data?.isViewed === true
      ? ''
      : css.blur
  }`

  return (
    <ButtonBase className={css.first_card} onClick={clickHandler}>
      <div className={style} ref={trigger.ref} style={{ backgroundImage: `url('${API_URL}/${src}')` }}>
        <code className={css.rank}>
          <span>#</span>
          {rank}
        </code>
        <div className={css.uploader}>
          <Avatar url={uploader.profilePic} alt={uploader.username} className={css.avatar} />
          <Username className={css.username} username={uploader.username} />
        </div>
        <div className={css.labels}>
          <div className={css.highest_valuer}>
            <span>Highest Valuer</span>
            <Username username={highestValuer} />
          </div>
          <div className={css.coin_wrapper}>
            <div className={css.coins}>
              <span>Gross Worth</span>
              <code>
                {numberFormat(grossWorth)} <CoinsIcon2 />
              </code>
            </div>
            <div className={css.coins}>
              <span>Net Worth</span>
              <code>
                {numberFormat(netWorth)} <CoinsIcon2 />
              </code>
            </div>
          </div>
        </div>
      </div>
    </ButtonBase>
  )
}

const BenchmarkCard = ({
  src,
  postId,
  rank,
  grossWorth,
  uploader,
  postKeeper,
  status,
  ...rest
}: BenchmarkCardProps_) => {
  const router = useRouter()
  const { profile } = useContext(ProfileContext)

  const clickHandler = () => router.push({ pathname: '/benchmarks/posts', query: { postId } })

  const trigger = useInViewport({})

  const { data } = useGetCurrentLead({ postId, status, watch: trigger.isVisible })

  const style = `${css.container} ${
    showStatusList.some(s => s === (data?.status || status)) ||
    profile._id === uploader._id ||
    profile._id === postKeeper._id ||
    data?.isViewed === true
      ? ''
      : css.blur
  }`

  return (
    <ButtonBase className={css.card} {...rest} onClick={clickHandler}>
      <div className={style}>
        <Image src={src} alt={postId} width="100%" height="100%" aspectRatio="8.5 / 11" />
        <div className={css.details}>
          <code className={css.rank}>
            <span>#</span>
            {rank}
          </code>
        </div>
      </div>
    </ButtonBase>
  )
}

export default BenchmarkCard
