import css from '../../../styles/components/ui/valuation-post/view-list.module.scss'

import { useMediaQuery } from '@mui/material'
import moment from 'moment'
import { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useViewList from '../../../api-routes/posts/valuation/fetch-view-list'
import { postActions } from '../../../data/actions'
import useFetchNextPage from '../../../hooks/fetch-next-page.hook'
import { storeType } from '../../../types'
import AvatarRing from '../avatar-ring'
import DialogBox from '../dialog-box'
import LikeCommentDrawer from '../like-comment-drawer'

const Wrapper = ({ children }: { children: ReactNode }) => {
  const [{ spendFor }, dispatch] = [useSelector((s: storeType) => s.postState), useDispatch()]

  const closeHandler = () => dispatch(postActions.closeSpendPopup())

  return useMediaQuery('(min-width: 720px)') ? (
    <DialogBox isOpen={!!spendFor} onClose={closeHandler}>
      {children}
    </DialogBox>
  ) : (
    <LikeCommentDrawer title={'View List'} open={!!spendFor} onClose={closeHandler}>
      {children}
    </LikeCommentDrawer>
  )
}

const ValuationViewListPopup = () => {
  const [{ spendFor }, isDesktop] = [
    useSelector((s: storeType) => s.postState),
    useMediaQuery('(min-width: 720px)')
  ]

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useViewList({
    postId: spendFor
  })

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  return (
    <Wrapper>
      <ul className={css.wrapper}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data?.pages.map((page, pageNo) => {
            const isLastPage = data.pages.length === pageNo + 1

            return page.map(({ isAgreed, name, profilePic, username, viewedAt }, indx) => (
              <li
                className={css.list_element}
                key={pageNo + indx}
                ref={isLastPage && indx === 15 ? nextPageTrigger : undefined}
              >
                <div className={css.profile_wrapper}>
                  <AvatarRing username={username} url={profilePic} size={36} disableClick />
                  <div className={css.username_wrapper}>
                    <p>{username}</p>
                    <span>{name}</span>
                  </div>
                </div>
                <div className={css.time_wrapper}>
                  <span className={isAgreed ? undefined : css.hide}>registered</span>
                  <time>~ {moment(viewedAt).fromNow()}</time>
                </div>
              </li>
            ))
          })
        )}
      </ul>
    </Wrapper>
  )
}

export default ValuationViewListPopup
