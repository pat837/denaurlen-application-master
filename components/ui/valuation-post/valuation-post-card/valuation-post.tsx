import constants from '../../../../config/constants'
import { sleep } from '../../../../utils'
import css from '../../../../styles/components/ui/valuation-post/valuation-post-card.module.scss'
import InterestedIcon from '../../../icons/interested.icon'
import Picture from '../../picture'

type ValuationPostProps_ = {
  src: string
  showPost: boolean
  onInterest: () => void
  isInterested: boolean
  rank?: number
}

const ValuationPost = ({ src, showPost, isInterested, onInterest, rank }: ValuationPostProps_) => {
  return (
    <div
      role="button"
      className={css.post_wrapper}
      onDoubleClick={event => {
        if (isInterested) return null
        const element = event.currentTarget
        element.classList.add(css.active_like)
        onInterest()
        sleep(1200, () => {
          element.classList.remove(css.active_like)
        })
      }}
    >
      <Picture alt="post" src={src} aspectRatio={`${constants.POST_ASPECT_RATIO}`} />
      <div className={`${css.cover} ${showPost && css.show}`} />
      <InterestedIcon className={css.like_icon} />
      {!rank || <span className={css.rank}>{rank}</span>}
    </div>
  )
}

export default ValuationPost
