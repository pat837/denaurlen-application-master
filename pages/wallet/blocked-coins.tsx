import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SwipeableViews from 'react-swipeable-views'

import useClaimCoins from '../../api-routes/transactions/claim-coins'
import useFetchBlockedCoins from '../../api-routes/transactions/fetch-blocked-coins'
import useFetchClaimedCoins from '../../api-routes/transactions/fetch-claimed-coins'
import CoinsIcon2 from '../../components/icons/coins2.icon'
import Button from '../../components/ui/button'
import Picture from '../../components/ui/picture'
import { ProfileContext } from '../../contexts/profile.context'
import { blocksPageActions } from '../../data/actions'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import usePageTitle from '../../hooks/page-title.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/blocked-coins.page.module.scss'

import type { BlockCoinsTab_, storeType } from '../../types'
import type { BlockCoins_ } from '../../types/transactions.types'

const BlockCard = ({ _id, postId, spendCoins }: BlockCoins_) => {
  const router = useRouter()
  const showToast = useToastMessage()

  const { mutate: claimCoins, isLoading } = useClaimCoins()

  const claimHandler = () =>
    claimCoins(
      { trackId: _id, postId: postId?._id || '' },
      {
        onError: (error: any) => {
          showToast(error?.response?.data?.message || 'Something went wrong, try later')
        }
      }
    )

  const clickHandler = (postId: string) => () => {
    router.push(`${router.basePath}/post/valuation/${postId}`)
  }

  return (
    <div className={css.card}>
      <div className={css.post} role="button" onClick={clickHandler(postId?._id || '')}>
        <Picture src={postId?.src[0] || ''} alt={`post-${postId?._id || ''}`} />
      </div>
      <div className={css.coins}>
        <code>
          <CoinsIcon2 />
          {spendCoins}
        </code>
        <span>Spend on this post</span>
      </div>
      {postId?.status === 'DECLARED' && (
        <Button label="claim" onClick={claimHandler} loading={isLoading} />
      )}
    </div>
  )
}

const BlockSection = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchBlockedCoins()

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  return (
    <section>
      {data?.pages.map((page, pageNo) => {
        const isLastPage = data.pages.length === pageNo + 1

        return page.map((blockCoins, index) => (
          <div key={blockCoins._id} ref={isLastPage && index == 12 ? nextPageTrigger : undefined}>
            <BlockCard {...blockCoins} />
          </div>
        ))
      })}
    </section>
  )
}

const ClaimedSection = () => {
  const { profile } = useContext(ProfileContext)
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchClaimedCoins(20)

  const router = useRouter()

  const clickHandler = (postId: string) => () => {
    router.push(`${router.basePath}/post/valuation/${postId}`)
  }

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  return (
    <section>
      {data?.pages.map((page, pageNo) => {
        const isLastPage = data.pages.length === pageNo + 1

        return page.map(({ _id, postId, spendCoins }, index) => (
          <div
            key={_id}
            className={css.card}
            ref={isLastPage && index === 12 ? nextPageTrigger : undefined}
          >
            <div className={css.post} role="button" onClick={clickHandler(postId?._id || '')}>
              <Picture src={postId?.src[0] || ''} alt={`post-${postId._id}`} />
            </div>
            <div className={css.coins}>
              <code>
                <CoinsIcon2 />
                {spendCoins}
              </code>
              <span>
                {postId?.highestValuer === profile._id
                  ? 'Your the highest valuer for this post'
                  : 'Spend on this post'}
              </span>
            </div>
            <></>
          </div>
        ))
      })}
    </section>
  )
}

const BlockedCoinsPage = () => {
  const dispatch = useDispatch()

  const { tab } = useSelector((s: storeType) => s.blockCoins)

  usePageTitle({ title: 'Blocked Coins' })

  const changeHandler = (tab: BlockCoinsTab_) => () => {
    dispatch(blocksPageActions.changeTab(tab))
  }
  const swipeHandler = (index: number) => {
    dispatch(blocksPageActions.changeTab(index === 0 ? 'blocked' : 'claim'))
  }

  return (
    <div className={css.page_wrapper}>
      <div className={css.navigation_section}>
        <input
          type="radio"
          name="tab"
          id="tab-0"
          value="blocked"
          checked={tab === 'blocked'}
          onChange={changeHandler('blocked')}
        />
        <input
          type="radio"
          name="tab"
          id="tab-1"
          value="claim"
          checked={tab === 'claim'}
          onChange={changeHandler('claim')}
        />
        <nav className={tab === 'blocked' ? css.tab1 : css.tab2}>
          <label htmlFor="tab-0">Blocked Coins</label>
          <label htmlFor="tab-1">Claim Coins</label>
        </nav>
      </div>
      <SwipeableViews
        index={tab === 'blocked' ? 0 : 1}
        onChangeIndex={swipeHandler}
        className={css.container}
      >
        <BlockSection />
        <ClaimedSection />
      </SwipeableViews>
    </div>
  )
}

BlockedCoinsPage.Layout = HomeLayout

export default BlockedCoinsPage
