import router from 'next/router'

import useFetchPostLikes from '../../../api-routes/posts/post-like/get-post-likes'
import { postType_ } from '../../../api-routes/posts/post-like/post-like.routes'
import useFetchNextPage from '../../../hooks/fetch-next-page.hook'
import Avatar from '../../ui/avatar'
import Button from '../../ui/button'
import css from './post-popup.module.scss'

type LikesListProps_ = {
  postId: string
  type: postType_
}

const LikesList = ({ postId, type }: LikesListProps_) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchPostLikes({
    postId,
    type
  })

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  if (isLoading)
    return (
      <div className={css.loader}>
        <p>Loading...</p>
      </div>
    )

  const handleView = (username: string) => () => router.replace(`/${username}`)

  return (
    <ul className={css.list}>
      {data?.pages.map((page, pageNo) => {
        const isLastPage = pageNo + 1 === data.pages.length

        return page.map((profile, indx) => (
          <li
            className={css.list_item}
            key={`${profile._id}-${indx}`}
            ref={(isLastPage && indx === 20 && nextPageTrigger) || undefined}
          >
            <Avatar alt={profile.username} url={profile.profilePic} />
            <div className={css.name}>
              <p>{profile.username}</p>
              <span>{profile.name}</span>
            </div>
            <Button label="view" variant="outline" onClick={handleView(profile.username)} />
          </li>
        ))
      })}
    </ul>
  )
}

export default LikesList
