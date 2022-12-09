import css from './benchmarks-section.module.scss'

import router from 'next/router'
import { useContext } from 'react'

import Picture from '../picture'
import CoinsIcon2 from '../../icons/coins2.icon'
import ConditionalRender from '../conditional-render'
import { numberFormat } from '../../../utils'
import useFetchBenchmarks from '../../../api-routes/benchmarks/fetch-benchmarks'
import type {
  ValuationPostStatus_,
  ValuationPostWithHighestValuer_
} from '../../../types/valuation-post.type'
import useGetCurrentLead from '../../../api-routes/posts/valuation/get-current-lead'
import { ProfileContext } from '../../../contexts/profile.context'

type BenchmarkCardProps_ = {
  post: ValuationPostWithHighestValuer_ & { grossWorth: number }
}

const showStatusList: readonly ValuationPostStatus_[] = ['ACTIVE', 'DECLARED', 'VALUED']

const BenchmarkCard = ({ post }: BenchmarkCardProps_) => {
  const { profile } = useContext(ProfileContext)

  const clickHandler = () => router.push({ pathname: '/benchmarks/posts', query: { postId: post._id } })

  const { data } = useGetCurrentLead({
    postId: post._id,
    status: post.status,
    watch: true
  })

  const style = `${css.post} ${
    showStatusList.some(s => s === (data?.status || post.status)) ||
    profile._id === post.uploader._id ||
    profile._id === post.postKeeper._id ||
    data?.isViewed === true
      ? ''
      : css.blur
  }`

  return (
    <div className={css.card}>
      <div className={style} role="button" aria-label="valuation-post" onClick={clickHandler}>
        <Picture removeRapper alt="valuation-post" src={post.src[0]} />
      </div>
      <div className={css.info}>
        <div className={css.rank_coins}>
          <span className={css.rank} />
          <div className={css.coins}>
            <CoinsIcon2 />
            <span>{numberFormat(post.grossWorth, post.grossWorth > 99999)}</span>
          </div>
        </div>
        <span className={css.uploader}>
          {(post.uploader.username.length > 15 && `${post.uploader.username.slice(0, 12)}...`) ||
            post.uploader.username}
        </span>
      </div>
    </div>
  )
}

const BenchmarksSection = () => {
  const { data, isLoading } = useFetchBenchmarks()

  return (
    <div className={css.section}>
      <div className={css.wrapper}>
        <h3>Benchmarks</h3>
        <div className={css.container}>
          <ConditionalRender condition={isLoading}>
            <></>
            <>
              {data?.pages[0].slice(0, 3).map(post => (
                <BenchmarkCard key={post._id} post={post} />
              ))}
            </>
          </ConditionalRender>
        </div>
      </div>
    </div>
  )
}

export { BenchmarksSection }
