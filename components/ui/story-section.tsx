import { useRouter } from 'next/router'
import { useContext } from 'react'
import { useDispatch } from 'react-redux'

import useGetStories from '../../api-routes/home-services/fetch-stories'
import useFetchStoriesByUsername from '../../api-routes/posts/story/fetch-stories'
import { ProfileContext } from '../../contexts/profile.context'
import { addPostActions } from '../../data/actions'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import css from '../../styles/components/ui/stories-section.module.scss'
import PlusIcon from '../icons/plus.icon'
import AvatarRing from './avatar-ring'

const StorySection = () => {
  const { data, isLoading, isLoadingError, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetStories(16)
  const { profile } = useContext(ProfileContext)
  const dispatch = useDispatch()
  const router = useRouter()

  const { data: selfStory } = useFetchStoriesByUsername(profile.username)

  const addOption = () => {
    dispatch(addPostActions.setCurrentPage(router.asPath))
    router.replace('/uploads/story')
  }

  const nextPageTriggerRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  if (isLoading) return <>Loading...</>

  if (isLoadingError || !data?.pages.length) return <>Error while fetching</>

  if (!data.pages[0].length) return <></>

  return (
    <div className={css.wrapper}>
      <div className={css.container}>
        {!selfStory?.length ? (
          <div>
            <div role="button" aria-label="add-story" className={css.add_button} onClick={addOption}>
              <AvatarRing username={profile.username} url={profile.profilePic} size={56} disableClick />
              <span className={css.icon}>
                <PlusIcon />
              </span>
            </div>
            <div style={{ height: '1rem' }} />
          </div>
        ) : (
          <div className={css.story}>
            <AvatarRing username={profile.username} url={profile.profilePic} showStories size={56} />
            <span>{profile.username}</span>
          </div>
        )}
        <span className={css.divider} />
        {data?.pages.map((page, index) => {
          const isLastPage = index + 1 === data.pages.length
          return page
            .filter(story => story.username !== profile.username)
            .map((story, indx) => (
              <div
                key={story._id}
                className={css.story}
                ref={(isLastPage && 10 === indx && nextPageTriggerRef) || undefined}
              >
                <AvatarRing username={story.username} url={story.profilePic} showStories size={56} />
                <span>{story.username}</span>
              </div>
            ))
        })}
      </div>
    </div>
  )
}

export default StorySection
