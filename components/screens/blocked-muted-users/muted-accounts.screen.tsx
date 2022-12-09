import router from 'next/router'

import useGetMutedUsers from '../../../api-routes/privacy/get-muted-users'
import useMuteUser from '../../../api-routes/privacy/mute-user'
import useFetchNextPage from '../../../hooks/fetch-next-page.hook'
import { PostUploaderWithName_ } from '../../../types'
import Avatar from '../../ui/avatar'
import Button from '../../ui/button'
import ConditionalRender from '../../ui/conditional-render'
import css from './blocked-muted-users.module.scss'

type ListItemProps_ = {
  user: PostUploaderWithName_
  createdAt: Date
}

const ListItem = ({ user }: ListItemProps_) => {
  const { mutate, isLoading } = useMuteUser({
    callback: {
      success: _r => {},
      error: _e => {}
    }
  })

  const unMuteHandler = () => mutate({ userId: user._id })
  const viewHandler = () => router.push(`/${user.username}`)

  return (
    <>
      <div className={css.user_wrapper} role="button" aria-label="view-profile" onClick={viewHandler}>
        <Avatar alt={user.username} url={user.profilePic} />
        <div>
          <p>{user.username}</p>
          <span>{user.name}</span>
        </div>
      </div>
      <Button label="un mute" variant="outline" loading={isLoading} onClick={unMuteHandler} />
    </>
  )
}

const MutedAccountsScreen = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetMutedUsers(30)
  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  return (
    <div className={css.page}>
      <div className={css.wrapper}>
        <ConditionalRender condition={isLoading}>
          <div className={css.loader}>Loading...</div>
          <ConditionalRender condition={!data?.pages?.[0]?.length}>
            <div className={css.empty_state}>
              <h4>No Accounts</h4>
              <p>Accounts you mute will appear here</p>
            </div>
            <ul className={css.list}>
              {data?.pages.map((page, pageNo) => {
                const isLastPage = pageNo === data.pages.length - 1

                return page.map(({ user, createdAt }, indx) => (
                  <li
                    key={`${user._id}-${indx}`}
                    className={css.list_item}
                    ref={(isLastPage && indx === 20 && nextPageTrigger) || undefined}
                  >
                    <ListItem user={user} createdAt={createdAt} />
                  </li>
                ))
              })}
            </ul>
          </ConditionalRender>
        </ConditionalRender>
      </div>
    </div>
  )
}

export default MutedAccountsScreen
