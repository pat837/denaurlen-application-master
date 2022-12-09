import { useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'

import useGetValuationPosts from '../../../api-routes/posts/valuation/get-valuation-posts'
import ValuationPostCard from '../../../components/ui/valuation-post/valuation-post-card'
import ValuationPostPreviewCard from '../../../components/ui/valuation-post/valuation-preview-card'
import constants from '../../../config/constants'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'
import css from '../../../styles/components/ui/valuation/view-page.module.scss'

const ValuationPostPage = () => {
  const [router, isDesktop] = [
    useRouter(),
    useMediaQuery(`(min-width: ${constants.POST_POPUP_MIN_WIDTH}px)`)
  ]

  const { data, isLoading } = useGetValuationPosts({
    username: (router.query?.username || '').toString(),
    size: 30
  })

  usePageTitle({ title: 'Valuation Posts' })

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
          <ValuationPostPreviewCard
            username={(router.query?.username || '').toString()}
            key={post._id}
            {...post}
          />
        ))
      )}
    </div>
  )
}

ValuationPostPage.Layout = HomeLayout

export default ValuationPostPage
