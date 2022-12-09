import router from 'next/router'

import { useGetGeneralPostById } from '../../../api-routes/posts'
import useGetCategoryPostById from '../../../api-routes/posts/category/get-by-id'
import useGetValuationPostById from '../../../api-routes/posts/valuation/get-post-by-id'
import PostCard from '../../../components/ui/category-post/card'
import GeneralPostCard from '../../../components/ui/general-post/card'
import ValuationPostCard from '../../../components/ui/valuation-post/valuation-post-card'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'
import css from '../../../styles/pages/share-post.module.scss'

const ValuationPost = () => {
  const { data, isLoading, isError } = useGetValuationPostById((router.query.id || '')?.toString())

  usePageTitle({ title: 'Valuation Post' })

  if (isLoading || !data) return <>Loading...</>

  if (isError) return <>Error while fetching..</>

  return (
    <div className={css.wrapper}>
      <div>
        <ValuationPostCard {...data} />
      </div>
    </div>
  )
}

const CategoryPost = () => {
  const { data: post, isLoading, isError } = useGetCategoryPostById((router.query.id || '')?.toString())

  usePageTitle({ title: 'Top 10 Post' })

  if (isLoading || !post) return <>Loading...</>

  if (isError) return <>Error while fetching..</>

  return (
    <div className={css.wrapper}>
      <div>
        <PostCard
          _id={post._id}
          caption={post.caption}
          category={post.category}
          createdAt={post.createdAt}
          ratio={post.ratio}
          slot={post.slot}
          src={post.src}
          title={post.title}
          url={post.url}
          uploader={{
            _id: post.uploader._id,
            profilePic: post.uploader.profilePic,
            username: post.uploader.username
          }}
          priority={post.uploader.categories.find(c => c.category === post.category._id)?.priority || 0}
        />
      </div>
    </div>
  )
}

const GeneralPost = () => {
  const { data, isLoading, isError } = useGetGeneralPostById((router.query.id || '')?.toString())

  usePageTitle({ title: 'General Post' })

  if (isLoading || !data) return <>Loading...</>

  if (isError) return <>Error while fetching..</>

  return (
    <div className={css.wrapper}>
      <div>
        <GeneralPostCard {...data} />
        <span />
      </div>
    </div>
  )
}

const SharedPostPage = () => {
  switch ((router.query?.postType || '').toString()) {
    case 'category':
    case 'top10':
      return <CategoryPost />

    case 'valuation':
      return <ValuationPost />

    case 'general':
      return <GeneralPost />

    default:
      return <></>
  }
}

SharedPostPage.Layout = HomeLayout

export default SharedPostPage
