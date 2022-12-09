import { ButtonBase, Skeleton } from '@mui/material'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import useGetCategories from '../../api-routes/categories/get-owned-categories'
import useFetchSlotOnePost from '../../api-routes/posts/category/get-slot-one-post'
import constants from '../../config/constants'
import storage from '../../config/storage'
import { categoryPageActions } from '../../data/actions'
import { TitleBar } from '../../pages/profile'
import css from '../../styles/profile-card.module.scss'
import previewCardCSS from '../../styles/top-10s-preview-card.module.scss'
import EmptyStateCameraIcon from '../icons/empty-state-camera.icon'
import TopTenPostIcon from '../icons/top10-post.icon'
import Image from './picture'
import { NoOfCategoryPost } from './profile-counts'

type PreviewCardProps = {
  categoryId: string
  username: string
  categoryName: string
  isOwnProfile: boolean
}

const PreviewCard = ({ categoryId, username, categoryName, isOwnProfile }: PreviewCardProps) => {
  const [router, dispatch] = [useRouter(), useDispatch()]

  const { data, isLoading } = useFetchSlotOnePost({ username, categoryId }, isOwnProfile)

  const clickHandler = () => {
    router.push(`/${isOwnProfile ? 'profile' : username}/categories/posts`)

    dispatch(categoryPageActions.setCurrentCategory(categoryId))
    storage.session.add({ key: 'current-category', value: { id: categoryId } })
  }

  return (
    <ButtonBase className={previewCardCSS.wrapper} onClick={clickHandler}>
      <div className={previewCardCSS.container}>
        {isLoading ? (
          <Skeleton animation="wave" variant="rectangular" className={previewCardCSS.loader} />
        ) : !data?.length ? (
          <div className={previewCardCSS.empty_state}>
            <EmptyStateCameraIcon />
          </div>
        ) : (
          <Image
            src={data[0].src[0]}
            alt={categoryName}
            quality={25}
            aspectRatio={`${constants.POST_ASPECT_RATIO}`}
          />
        )}
        <div className={previewCardCSS.title}>
          <span>{categoryName}</span>
        </div>
      </div>
    </ButtonBase>
  )
}

const TopTenPostInProfile = ({ username, isOwnProfile }: { username: string; isOwnProfile: boolean }) => {
  const dispatch = useDispatch()
  const { data, isLoading } = useGetCategories(username, isOwnProfile)

  return (
    <div className={css['post-container-root-wrapper']}>
      <TitleBar
        title={
          <>
            Top 10&apos;s Posts <NoOfCategoryPost username={username} />
          </>
        }
        icon={<TopTenPostIcon />}
        link={(isOwnProfile && '/profile/categories/posts') || `/${username}/categories/posts`}
        showSeeAll
        onClick={() => {
          const categoryId = (data?.find(({ priority }) => priority === 1) || { category: { _id: '' } }).category
            ._id

          dispatch(categoryPageActions.setCurrentCategory(categoryId))
          storage.session.add({ key: 'current-category', value: { id: categoryId } })
        }}
      />
      <div className={css['post-container-wrapper']}>
        <div className={css['post-container']}>
          {isLoading || !data?.length
            ? Array.from(Array(10).keys()).map(index => (
                <Skeleton
                  key={`loading-indicator-${index}`}
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  style={{ aspectRatio: '8 / 10', borderRadius: 10 }}
                />
              ))
            : data?.map((item, indx) => (
                <PreviewCard
                  key={item?._id || indx}
                  categoryId={item?.category?._id || ''}
                  categoryName={`${item?.priority}. ${item?.category?.name}`}
                  username={username}
                  isOwnProfile={isOwnProfile}
                />
              ))}
          <span className={css['overflow-fix']} />
        </div>
      </div>
    </div>
  )
}

export default TopTenPostInProfile
