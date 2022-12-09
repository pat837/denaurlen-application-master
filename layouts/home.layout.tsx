import { useMediaQuery } from '@mui/material'
import { FC, ReactFragment, ReactNode } from 'react'

import CategoryInterestPopup from '../components/popups/confirm-popup/category-interest.popup'
import ConfirmFollowPopup from '../components/popups/confirm-popup/confirm-follow.popup'
import ConfirmUnFollowPopup from '../components/popups/confirm-popup/confirm-unfollow.popup'
import ValuationInterestPopup from '../components/popups/confirm-popup/valuation-interest.popup'
import PostKeeperFollowPopup from '../components/popups/post-keeper-follow/post-keeper-follow.popup'
import PostLikesPopup from '../components/popups/post-likes-popup'
import ReportsPopup from '../components/popups/reports/reports.popup'
import SharePostMenu from '../components/popups/share-post-menu'
import DailyLoginRewardsScreen from '../components/screens/daily-login-rewards'
import ActivityScreen from '../components/screens/notification-screen'
import Appbar from '../components/ui/appbar'
import BottomNavbar from '../components/ui/bottom-navbar'
import CommentsView from '../components/ui/comments-view'
import CommentsViewForTop10s from '../components/ui/comments-view-for-top10s'
import EditOptionPopup from '../components/ui/edit-option'
import { MoreOptionsWithEdit } from '../components/ui/post-more-options'
import PostOptionsPopup from '../components/ui/post-options-popup'
import RevaluationConfirmPopup from '../components/ui/revaluation-confirm.popup'
import Sidebar from '../components/ui/sidebar'
import StoriesPopup from '../components/ui/stories-popup'
import StoryViewPopup from '../components/ui/story-view-popup'
import TagsView from '../components/ui/tags-view'
import ValuationViewListPopup from '../components/ui/valuation-post/view-list-popup'
import ValuationCommentsPopup from '../components/ui/ValuationPost/CommentsPopup'
import css from '../styles/layout.module.scss'

type HomeLayoutProps = {
  children: ReactNode | FC | ReactFragment
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  const isDesktop = useMediaQuery('(min-width:1080px)')

  return (
    <>
      <Appbar />
      <div className={css.home_layout}>
        {isDesktop && <Sidebar />}
        <main>{children}</main>
      </div>
      {isDesktop || <BottomNavbar />}
      <CommentsView />
      <TagsView />
      <CommentsViewForTop10s />
      <ValuationCommentsPopup />
      <MoreOptionsWithEdit />
      <PostOptionsPopup />
      <EditOptionPopup />
      <StoryViewPopup />
      <StoriesPopup />
      <ValuationViewListPopup />
      <RevaluationConfirmPopup />
      <CategoryInterestPopup />
      <ValuationInterestPopup />
      <ConfirmFollowPopup />
      <ConfirmUnFollowPopup />
      <ActivityScreen />
      <PostLikesPopup />
      <PostKeeperFollowPopup />
      <ReportsPopup />
      <DailyLoginRewardsScreen />
      <SharePostMenu />
    </>
  )
}

export default HomeLayout
