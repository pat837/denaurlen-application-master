import { useMediaQuery } from '@mui/material'
import { useContext } from 'react'

import useGetValuedPosts from '../../../api-routes/posts/valuation/get-valued-post'
import ValuationPostCard from '../../../components/ui/valuation-post/valuation-post-card'
import ValuationPostPreviewCard from '../../../components/ui/valuation-post/valuation-preview-card'
import constants from '../../../config/constants'
import { ProfileContext } from '../../../contexts/profile.context'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'
import css from '../../../styles/components/ui/valuation/view-page.module.scss'

const ValuationPostPage = () => {
  const [{ profile }, isDesktop] = [
    useContext(ProfileContext),
    useMediaQuery(`(min-width: ${constants.POST_POPUP_MIN_WIDTH}px)`)
  ]

  const { data, isLoading } = useGetValuedPosts({
    username: profile.username,
    size: 30
  })

  usePageTitle({ title: 'Valued Posts' })

  if (isLoading || !data?.pages) return <div>Loading...</div>

  if (isDesktop)
    return (
      <div className={css.valuation_post_page_wrapper}>
        {data?.pages.map(group =>
          group.map(({ highestValuer, ...post }) => (
            <ValuationPostCard {...post} highestValuer={highestValuer._id} key={post._id} />
          ))
        )}
      </div>
    )

  return (
    <div className={css.valuation_post_page_wrapper_mobile}>
      {data?.pages.map(group =>
        group.map(post => (
          <ValuationPostPreviewCard username={profile.username} key={post._id} {...post} />
        ))
      )}
    </div>
  )
}

ValuationPostPage.Layout = HomeLayout

export default ValuationPostPage
