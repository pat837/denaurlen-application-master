import css from './../../../../styles/components/ui/valuation-post/valuation-post-card.module.scss'

import { IconButton } from '@mui/material'
import { ValuationPostStatus_ } from '../../../../types/valuation-post.type'
import AvatarRing from '../../avatar-ring'
import { PostUploader_ } from '../../../../types'
import MoreHorizontalIcon from '../../../icons/more-horizontal.icon'
import Username from '../../username'
import CoinsIcon2 from '../../../icons/coins2.icon'
import OnGoingIcon from '../../../icons/on-going.icon'
import useGetCurrentLead from '../../../../api-routes/posts/valuation/get-current-lead'
import { numberFormat } from '../../../../utils'
import { postActions } from '../../../../data/actions'
import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { ProfileContext } from '../../../../contexts/profile.context'
import constants from '../../../../config/constants'

type ValuationPostCardHeaderProps_ = {
  uploader: PostUploader_
  status: ValuationPostStatus_
  postId: string
  caption: string
  watchCoins: boolean
}
type Props_ = ValuationPostCardHeaderProps_

type GrossWorthProps_ = {
  status: ValuationPostStatus_
  postId: string
  watchCoins: boolean
}

const ValuationPostCardHeader = ({ uploader, status, postId, caption, watchCoins }: Props_) => {
  const [{ profile }, dispatch] = [useContext(ProfileContext), useDispatch()]

  const menuHandler = () => {
    if (profile._id == uploader._id)
      dispatch(
        postActions.showMoreOptionsWithEdit({
          postId: postId,
          caption: caption,
          title: '',
          link: '',
          typeOfPost: 'VALUATION',
          categoryId: ''
        })
      )
    else dispatch(postActions.showMoreOptions(postId, uploader._id, 'VALUATION'))
  }

  return (
    <div className={css.card_header}>
      <div className={css.profile_section}>
        <AvatarRing
          username={uploader.username}
          url={uploader.profilePic}
          showStories
          size={constants.POST_UPLOADER_AVATAR_SIZE}
        />
        <div>
          <Username username={uploader.username} />
        </div>
      </div>
      <div className={css.options}>
        <div className={css.gross_worth_wrapper}>
          <div>
            <CoinsIcon2 />
            <span>
              <GrossWorth postId={postId} status={status} watchCoins={watchCoins} />
            </span>
            <OnGoingIcon />
          </div>
          <span>Gross worth</span>
        </div>
        <IconButton aria-label="post-options" onClick={menuHandler}>
          <MoreHorizontalIcon />
        </IconButton>
      </div>
    </div>
  )
}

const GrossWorth = ({ postId, status, watchCoins }: GrossWorthProps_) => {
  const { data } = useGetCurrentLead({ postId, status, watch: watchCoins })

  return <>{numberFormat(data?.grossWorth || 0, (data?.grossWorth || 0) > 9999)}</>
}

export default ValuationPostCardHeader
