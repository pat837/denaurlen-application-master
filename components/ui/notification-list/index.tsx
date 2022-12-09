import css from './notifications.module.scss'

import useFetchNotifications from '../../../api-routes/notifications/get-notifications'
import useFetchNextPage from '../../../hooks/fetch-next-page.hook'
import ConditionalRender from '../conditional-render'
import { NotificationCard } from './notification-card'
import DotLoader from '../dot-loader'

export const NOTIFICATIONS_PER_PAGE = 20

const NotificationList = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useFetchNotifications(NOTIFICATIONS_PER_PAGE)

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  return (
    <ConditionalRender condition={isLoading}>
      <div className={css.loader}>
        <DotLoader />
      </div>
      <ul className={css.list}>
        {data?.pages.map((page, pageNo) => {
          const isLastPage = pageNo + 1 === data.pages.length

          return page.map((notification, indx) => (
            <li
              key={`${notification._id}-${indx}`}
              ref={isLastPage && indx === NOTIFICATIONS_PER_PAGE - 8 ? nextPageTrigger : undefined}
            >
              <NotificationCard notification={notification} />
            </li>
          ))
        })}
      </ul>
    </ConditionalRender>
  )
}

export default NotificationList
