import css from '../../../styles/components/ui/valuation-post/valuation-preview-card.module.scss'

import { ButtonBase } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import { ProfileContext } from '../../../contexts/profile.context'
import constants from '../../../config/constants'
import Picture from '../picture'
import { numberFormat } from '../../../utils'
import CoinsIcon2 from '../../icons/coins2.icon'
import type {
  ValuationPostStatus_,
  ValuationPostWithHighestValuer_
} from '../../../types/valuation-post.type'
import ConditionalRender from '../conditional-render'

type ValuationPreviewCardProps_ = ValuationPostWithHighestValuer_ & {
  isValuedPost?: boolean
  username: string
  isOngoing?: boolean
  showPost?: boolean
  isRegistered?: boolean
  isFollowings?: boolean
}

const statusList: ValuationPostStatus_[] = ['ACTIVE', 'DECLARED', 'VALUED']

const ValuationPreviewCard = ({
  showPost,
  isValuedPost = false,
  isOngoing,
  isFollowings,
  username,
  ...post
}: ValuationPreviewCardProps_) => {
  const [router, { profile }] = [useRouter(), useContext(ProfileContext)]

  const handleClick = () => {
    if (isFollowings)
      return router.push({ query: { postId: post._id }, pathname: '/profile/following-on-going' })

    router.push({
      pathname: `/${username === profile.username ? 'profile' : username}/${
        isValuedPost ? 'valued' : 'valuation'
      }/${isOngoing ? 'on-going' : 'view'}`,
      query: { postId: post._id }
    })
  }

  return (
    <ButtonBase className={css.container} onClick={handleClick}>
      <div className={css.wrapper}>
        <Picture alt="post" src={post.src[0]} aspectRatio={`${constants.POST_ASPECT_RATIO}`} />
        <div
          className={`${css.blur_wrapper} ${
            (statusList.some(status => status === post.status) ||
              profile._id === post.uploader._id ||
              profile._id === post.postKeeper?._id ||
              isValuedPost ||
              showPost) &&
            css.show
          }`}
        />
        <div className={css.details}>
          <span className={css.net_worth}>
            <CoinsIcon2 className={css.coins} />
            <span>{numberFormat(post.netWorth, post.netWorth > 9999)}</span>
          </span>
          <span className={`${css.username} ${isOngoing}`}>
            <ConditionalRender condition={isOngoing || !isValuedPost}>
              <>{post?.highestValuer?.username || post.postKeeper?.username || post.uploader.username}</>
              <>{post.postKeeper?.username || post.uploader.username}</>
            </ConditionalRender>
          </span>
        </div>
      </div>
    </ButtonBase>
  )
}

export default ValuationPreviewCard
