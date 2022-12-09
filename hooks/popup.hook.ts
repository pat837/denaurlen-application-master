import { useRouter } from 'next/router'

export const popupList = {
  followersFollowing: 'followers-following',
  referralCode: 'referral-code',
  exploreSearch: 'explore-search',
  valuationCriteria: 'valuation-criteria',
  categoryInteresting: 'category-interesting',
  valuationInteresting: 'valuation-interesting',
  beforeFollow: 'before-follow',
  confirmUnfollow: 'confirm-unfollow',
  categoryPostPopup: 'category-post-popup',
  activityScreen: 'activity-screen',
  profileOptions: 'profile-options',
  postLikes: 'post-likes',
  postKeeperFollow: 'post-keeper-follow',
  report: 'report',
  dailyRewards: 'daily-login-rewards',
  conversationInfo: 'conversation-info',
  graphColorPalette: 'graph-color-palette',
  knowYourPin: 'know-your-pin',
  resetOTP: 'reset-otp',
  resetPin: 'reset-pin',
  updatePin: 'update-pin',
  bioPreview: 'bio-preview',
  postShareMenu: 'post-share-menu'
} as const

const popupTypes = Object.values(popupList)

export type PopupType_ = typeof popupTypes[number]
export type OpenPopupOptions_ = {
  replace?: boolean
  params?: { [key: string]: any }
  shallow?: boolean
}

const usePopup = () => {
  const router = useRouter()

  const openPopup = (popup: PopupType_, options?: OpenPopupOptions_) => {
    const { replace, params, shallow } =
      options === undefined ? { replace: false, params: {}, shallow: true } : options
    const { popups: queryPopups, ...rest } = router.query

    const popups =
      typeof queryPopups === 'string' ? [queryPopups] : typeof queryPopups === 'undefined' ? [] : queryPopups

    router[replace ? 'replace' : 'push'](
      {
        pathname: router.asPath.split('?')[0],
        query: { popups: [...popups, popup], ...params, ...rest }
      },
      undefined,
      { shallow: shallow === undefined || shallow }
    )
  }
  const closePopup = () => router.back()

  const isOpen = (popup: PopupType_) => {
    const popups = router.query?.popups

    if (typeof popups === 'undefined') return false

    if (typeof popups === 'string') return popup === popups

    return popups.some(p => p === popup)
  }

  return { openPopup, closePopup, isOpen }
}

export default usePopup
