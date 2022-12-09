import { Avatar } from '@mui/material'

import { useGetFollowersList } from '../../../api-routes/Profile'
import { getMediaURL } from '../../../utils/get-url'
import css from './followers-list.module.scss'

const FollowersListScreen = ({ username }: { username: string }) => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetFollowersList({
    username,
    size: 20
  })

  if (isLoading)
    return (
      <div className={css.wrapper}>
        <span>Loading...</span>
      </div>
    )

  return (
    <div className={css.wrapper}>
      {data?.pages.map(profile => (
        <div key={profile._id}>
          <div>
            <Avatar src={getMediaURL(profile.profilePic)} />
            <div>
              <p>{profile.username}</p>
              <span>{profile.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FollowersListScreen
