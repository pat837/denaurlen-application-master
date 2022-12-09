import css from '../../../../styles/components/ui/valuation-post/valuation-post-card.module.scss'

import { useContext } from 'react'
import { useDispatch } from 'react-redux'

import useGetCurrentLead from '../../../../api-routes/posts/valuation/get-current-lead'
import useGetValuationPostCounts from '../../../../api-routes/posts/valuation/get-post-counts'
import { ProfileContext } from '../../../../contexts/profile.context'
import { toastActions } from '../../../../data/actions'
import { ValuationPostStatus_, ValuationPost_ } from '../../../../types/valuation-post.type'
import ValuationPostCardFooter from './card-footer'
import ValuationPostCardHeader from './card-header'
import ValuationPost from './valuation-post'
import useInViewport from '../../../../hooks/in-viewport.hook'
import useInteresting from '../../../../hooks/interesting.hook'
import useToastMessage from '../../../../hooks/toast-message.hook'

type ValuationPostCardProps_ = ValuationPost_ & {
  rank?: number
}

const showStatusList: readonly ValuationPostStatus_[] = ['ACTIVE', 'DECLARED', 'VALUED']

const ValuationPostCard = ({ rank, ...post }: ValuationPostCardProps_) => {
  const { profile } = useContext(ProfileContext)
  const showToast = useToastMessage()

  const leadSection = useInViewport({})

  const { data } = useGetCurrentLead({
    postId: post._id,
    status: post.status,
    watch: leadSection.isVisible
  })

  const { data: counts, isLoading } = useGetValuationPostCounts({ postId: post._id })

  const interestPost = useInteresting({
    type: 'valuation',
    callback: {
      success: () => {},
      error: () => {
        showToast('Unable to interest post')
      }
    }
  })

  const interestingHandler = () => {
    if (counts?.isInterested) return null
    interestPost(post._id)
  }

  return (
    <div className={css.card} id={post._id}>
      <ValuationPostCardHeader
        caption={post.caption}
        postId={post._id}
        uploader={post.uploader}
        status={data?.status || post.status}
        watchCoins={leadSection.isVisible}
      />
      <ValuationPost
        src={post.src[0]}
        showPost={
          showStatusList.some(s => s === (data?.status || post.status)) ||
          profile._id === post.uploader._id ||
          profile._id === post.postKeeper._id ||
          data?.isViewed === true
        }
        isInterested={counts?.isInterested || false}
        onInterest={interestingHandler}
        rank={rank}
      />
      <ValuationPostCardFooter
        postId={post._id}
        postedAt={post.createdAt}
        status={data?.status || post.status}
        onInterest={interestingHandler}
        interestingCounts={counts?.interestsCount || 0}
        isInterested={counts?.isInterested || false}
        uploaderId={post.uploader._id}
        postKeeper={post.postKeeper}
        commentCount={counts?.commentsCount || 0}
        isLoading={isLoading}
        leadSection={leadSection}
        caption={post.caption}
      />
    </div>
  )
}

export default ValuationPostCard
