import css from '../../../../styles/components/ui/valuation-post/valuation-post-card.module.scss'

import { IconButton } from '@mui/material'
import moment from 'moment'
import Link from 'next/link'
import { MutableRefObject, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useAgreeToValuation from '../../../../api-routes/posts/valuation/agree-to-play'
import useFetchViewCounts from '../../../../api-routes/posts/valuation/fetch-view-counts'
import useGetCurrentLead from '../../../../api-routes/posts/valuation/get-current-lead'
import useSetLead from '../../../../api-routes/posts/valuation/set-lead'
import useViewValuationPost from '../../../../api-routes/posts/valuation/view-post'
import { numberFormat, dateFormat } from '../../../../utils'
import { ProfileContext } from '../../../../contexts/profile.context'
import { postActions } from '../../../../data/actions'
import useInViewport from '../../../../hooks/in-viewport.hook'
import { PostUploader_, storeType } from '../../../../types'
import { ValuationPostStatus_ } from '../../../../types/valuation-post.type'
import CoinsIcon2 from '../../../icons/coins2.icon'
import CommentsIcon from '../../../icons/comments.icon'
import EyeIcon from '../../../icons/eye.icon'
import InterestedIcon from '../../../icons/interested.icon'
import InterestingIcon from '../../../icons/interesting.icon'
import MoreHorizontalIcon from '../../../icons/more-horizontal.icon'
import OnGoingIcon from '../../../icons/on-going.icon'
import SendIcon from '../../../icons/send.icon'
import AvatarRing from '../../avatar-ring'
import Button from '../../button'
import { PostButton } from '../../general-post/card'
import Popup from '../../popup'
import { CountDown } from '../../ValuationPost/ValuationPostCard2'
import ConditionalRender from '../../conditional-render'
import useIsFollowing from '../../../../api-routes/profile-queries/follow-following/is-following'
import ReadMore from '../../read-more'
import useOpenPostLikes from '../../../../hooks/open-post-likes.hook'
import usePopup from '../../../../hooks/popup.hook'
import useToastMessage from '../../../../hooks/toast-message.hook'
import useSharePostMenu from '../../../../hooks/share-post-menu.hook'

type ValuationPostCardFooterProps_ = {
  postId: string
  postedAt: Date
  status: ValuationPostStatus_
  uploaderId: string
  postKeeper: PostUploader_
  onInterest: () => void
  interestingCounts: number
  isInterested: boolean
  commentCount: number
  isLoading: boolean
  caption: string
  leadSection: {
    ref: MutableRefObject<HTMLDivElement | null>
    isVisible: boolean
  }
}
type Props_ = ValuationPostCardFooterProps_

type LeadSectionProps_ = {
  status: ValuationPostStatus_
  postId: string
  uploaderId: string
  postKeeper: PostUploader_
  leadSection: {
    ref: MutableRefObject<HTMLDivElement | null>
    isVisible: boolean
  }
}
type SubLeadSectionProps_ = {
  postId: string
  leadSection: {
    ref: MutableRefObject<HTMLDivElement | null>
    isVisible: boolean
  }
  status: ValuationPostStatus_
  postKeeper: PostUploader_
}

const leadButtonDisabledStatusList: readonly ValuationPostStatus_[] = ['BUZZ', 'VALUED', 'DECLARED', 'HOLD']

const ValuationPostCardFooter = ({
  postId,
  postedAt,
  status,
  postKeeper,
  onInterest,
  interestingCounts,
  isInterested,
  commentCount,
  isLoading,
  leadSection,
  caption,
  uploaderId
}: Props_) => {
  const sharePost = useSharePostMenu({ type: 'post', isForward: false, postId })
  const dispatch = useDispatch()
  const viewInterestsHandler = useOpenPostLikes({ postId, type: 'valuation' })

  const footer = useInViewport({})

  const commentHandler = () => {
    dispatch(postActions.showComments(postId, 'VALUATION'))
  }

  return (
    <div ref={footer.ref}>
      <LeadSection
        leadSection={leadSection}
        postId={postId}
        status={status}
        postKeeper={postKeeper}
        uploaderId={uploaderId}
      />
      {!caption || (
        <p className={css.caption}>
          <ReadMore text={caption} />
        </p>
      )}
      <div className={css.post_footer}>
        <div className={css.footer_row}>
          <div className={css.like_comment_wrapper}>
            <PostButton
              label="interest-post"
              icon={
                <ConditionalRender condition={isInterested}>
                  <InterestedIcon />
                  <InterestingIcon />
                </ConditionalRender>
              }
              onClick={onInterest}
            />
            <PostButton label="comments" icon={<CommentsIcon />} onClick={commentHandler} />
            <PostButton label="share" icon={<SendIcon />} onClick={sharePost} />
          </div>
          <ConditionalRender condition={footer.isVisible}>
            <ConditionalRender condition={status === 'HOLD' || status === 'DECLARED' || status === 'VALUED'}>
              <CountDown endTime={moment(postedAt).add(0, 'd').toDate()} />
              <ConditionalRender condition={status === 'PRE-BUZZ'}>
                <CountDown endTime={moment(postedAt).add(1, 'd').toDate()} />
                <CountDown endTime={moment(postedAt).add(4, 'd').toDate()} />
              </ConditionalRender>
            </ConditionalRender>
            <></>
          </ConditionalRender>
        </div>
        <div className={css.post_details}>
          <div>
            <ConditionalRender condition={isLoading}>
              <span>Loading...</span>
              <>
                <ConditionalRender condition={interestingCounts === 0}>
                  <span>No one interested yet</span>
                  <span role="button" onClick={viewInterestsHandler}>
                    <span className={css.count}>{numberFormat(interestingCounts, true)}</span> Interests
                  </span>
                </ConditionalRender>
                <ConditionalRender condition={commentCount === 0}>
                  <></>
                  <>
                    <span>&nbsp; | &nbsp;</span>
                    <span role="button" onClick={commentHandler}>
                      <span className={css.count}>{numberFormat(commentCount, true)}</span> Comments
                    </span>
                  </>
                </ConditionalRender>
              </>
            </ConditionalRender>
          </div>
          <time>{dateFormat(postedAt)}</time>
        </div>
      </div>
    </div>
  )
}

const UploaderLeadSection = ({
  postId,
  leadSection,
  status,
  isPostKeeper
}: SubLeadSectionProps_ & { isPostKeeper: boolean }) => {
  const dispatch = useDispatch()
  const { profile } = useContext(ProfileContext)
  const { data: counts } = useFetchViewCounts(postId)

  const { data } = useGetCurrentLead({
    postId,
    status,
    watch: leadSection.isVisible
  })

  const handleRevert = () => {
    dispatch(postActions.openRevaluationPopup({ type: 'REVERT', postId, baseValue: data?.netWorth || 0 }))
  }

  const viewListHandler = () => dispatch(postActions.showSpendPopup(postId))

  const handleInfinite = () => {
    dispatch(postActions.openRevaluationPopup({ type: 'INFINITE', postId, baseValue: data?.netWorth || 0 }))
  }

  return (
    <div className={css.lead_section} ref={leadSection.ref}>
      <ConditionalRender condition={status === 'PRE-BUZZ' || status === 'BUZZ'}>
        <div>
          <div className={css.counts}>
            <span className={css.views}>
              <EyeIcon /> {counts?.viewsCount || 0}
            </span>
            <span>|</span>
            <span className={css.registered}>
              Registered: <span>{counts?.agreedCount || 0}</span>
            </span>
          </div>
        </div>
        <div className={css.current_lead}>
          <AvatarRing
            username={data?.highestValuer?.username || ''}
            url={data?.highestValuer?.profilePic}
            size={36}
          />
          <div>
            <div className={css.net_worth}>
              <CoinsIcon2 />
              <span>{numberFormat(data?.netWorth || 0, (data?.netWorth || 0) > 9999)}</span>
              <OnGoingIcon />
            </div>
            <ConditionalRender condition={!data?.highestValuer?.username}>
              <span className={css.no_lead}>No one valued yet</span>
              <Link href={`/${data?.highestValuer?.username}`} passHref>
                <a className={css.lead_name}>
                  {data?.highestValuer?.username}{' '}
                  <span>{status === 'ACTIVE' ? 'in Lead' : 'is the highest valuer'}</span>
                </a>
              </Link>
            </ConditionalRender>
          </div>
        </div>
      </ConditionalRender>
      <ConditionalRender condition={status === 'HOLD'}>
        {isPostKeeper && <Button label="revert" onClick={handleRevert} />}
        <ConditionalRender condition={status === 'DECLARED' && profile._id === data?.highestValuer._id}>
          <Button label="infinite" onClick={handleInfinite} />
          <IconButton aria-label="view-list" onClick={viewListHandler}>
            <MoreHorizontalIcon />
          </IconButton>
        </ConditionalRender>
      </ConditionalRender>
    </div>
  )
}

const OthersLeadSection = ({ postId, status, leadSection, postKeeper }: SubLeadSectionProps_) => {
  const [{ profile }, dispatch, { openPopup }, showToast] = [
    useContext(ProfileContext),
    useDispatch(),
    usePopup(),
    useToastMessage()
  ]

  const { data: counts } = useFetchViewCounts(postId)
  const { data: isFollowingPostKeeper } = useIsFollowing(postKeeper._id)

  const { data, isLoading: isDataLoading } = useGetCurrentLead({
    postId,
    status,
    watch: leadSection.isVisible
  })

  const { mutate: setLead, isLoading } = useSetLead({
    onError: error => {
      showToast(error?.response?.data?.message || 'Unable to proceed, try again')
    },
    onSuccess: res => {
      if (res?.data?.message) showToast(res?.data?.message)
    },
    currentUser: {
      _id: profile._id,
      username: profile.username,
      profilePic: profile.profilePic,
      name: profile.name
    }
  })
  const { mutate: spend, isLoading: isSpending } = useViewValuationPost({
    callbacks: {
      success: () => {
        showToast('Coins are deducted form your wallet')
      },
      error: () => {
        showToast('Unable to proceed, try later')
      }
    }
  })

  const { mutate: register, isLoading: isRegistering } = useAgreeToValuation({
    callbacks: {
      success: (res: any) => {
        showToast(res.data.message)
      },
      error: () => {
        showToast('Unable to proceed, try later')
      }
    }
  })

  const getInfoButtonText = () => {
    if (status === 'BUZZ') return 'game starts in'

    const isHigherValuer = data?.highestValuer?._id === profile._id

    if (status === 'VALUED') return isHigherValuer ? 'you won' : 'game over'
    if (status === 'DECLARED') return <span style={{ color: 'transparent' }}>O</span>

    if (status === 'HOLD') return 'Post on Hold'
  }

  const handleLead = () => {
    if (data?.isAgreed) return setLead(postId)

    if ('vibrate' in navigator) navigator?.vibrate(100)
    showToast('You must register to participate in the game')
  }

  const handleSpend = () => spend(postId)

  const handleRegistration = () => {
    if (isFollowingPostKeeper) register(postId)
    else {
      openPopup('post-keeper-follow', { params: postKeeper })
    }
  }

  const handleInfinite = () => {
    dispatch(postActions.openRevaluationPopup({ type: 'INFINITE', postId, baseValue: data?.netWorth || 0 }))
  }

  const clickHandler = status === 'ACTIVE' ? handleLead : data?.isViewed ? handleRegistration : handleSpend

  return (
    <div className={css.lead_section} ref={leadSection.ref}>
      {status === 'PRE-BUZZ' || status === 'BUZZ' ? (
        <div>
          <div className={css.counts}>
            {!data?.isViewed ? (
              <span className={css.views}>
                <EyeIcon /> {counts?.viewsCount || 0}
              </span>
            ) : (
              <span className={css.registered}>
                Registered: <span>{counts?.agreedCount || 0}</span>
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className={css.current_lead}>
          <AvatarRing
            username={data?.highestValuer?.username || ''}
            url={data?.highestValuer?.profilePic}
            size={36}
          />
          <div>
            <div className={css.net_worth}>
              <CoinsIcon2 />
              <span>{numberFormat(data?.netWorth || 0, (data?.netWorth || 0) > 9999)}</span>
              <OnGoingIcon />
            </div>
            {!data?.highestValuer?.username ? (
              <span className={css.no_lead}>No one has valued yet</span>
            ) : (
              <Link href={`/${data?.highestValuer?.username}`} passHref>
                <a className={css.lead_name}>
                  {data?.highestValuer?.username}{' '}
                  <span>{status === 'ACTIVE' ? 'in Lead' : 'is the highest valuer'}</span>
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
      {leadButtonDisabledStatusList.some(s => s === status) ? (
        status === 'DECLARED' && data?.highestValuer?._id === profile._id ? (
          <Button label="Infinite" onClick={handleInfinite} />
        ) : (
          <Button label={getInfoButtonText()} variant="contained" disabled />
        )
      ) : (
        <Button
          label={
            status === 'ACTIVE' ? 'lead + 100' : data?.isViewed ? `register${data?.isAgreed ? 'ed' : ''}` : 'view'
          }
          loading={isLoading || isDataLoading || isSpending || isRegistering}
          onClick={clickHandler}
          disabled={
            status === 'BUZZ' ||
            (status === 'PRE-BUZZ' && data?.isAgreed) ||
            data?.highestValuer?._id === profile._id
          }
          className={css.lead_btn}
          variant={status === 'BUZZ' || (status === 'PRE-BUZZ' && data?.isAgreed) ? 'contained' : 'filled'}
        />
      )}
    </div>
  )
}

const LeadSection = ({ postId, status, uploaderId, postKeeper, leadSection }: LeadSectionProps_) => {
  const { profile } = useContext(ProfileContext)

  return postKeeper._id === profile._id || uploaderId === profile._id ? (
    <UploaderLeadSection
      leadSection={leadSection}
      postId={postId}
      status={status}
      isPostKeeper={postKeeper._id === profile._id}
      postKeeper={postKeeper}
    />
  ) : (
    <OthersLeadSection leadSection={leadSection} postId={postId} status={status} postKeeper={postKeeper} />
  )
}

export const ValuationSpendPopup = () => {
  const [dispatch, { spendFor }] = [useDispatch(), useSelector((s: storeType) => s.postState)]

  const closeHandler = () => {
    dispatch(postActions.closeSpendPopup())
  }

  return (
    <Popup open={!!spendFor} onClose={closeHandler}>
      {' '}
    </Popup>
  )
}

export default ValuationPostCardFooter
