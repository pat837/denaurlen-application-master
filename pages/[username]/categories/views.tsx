import { Fab, Skeleton, Toolbar, useMediaQuery, useScrollTrigger } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useGetOwnedCategories from '../../../api-routes/categories/get-owned-categories'
import useFetchPostByCategory from '../../../api-routes/posts/category/fetch-by-category'
import useGetProfile from '../../../api-routes/profile-queries/fetch-profile'
import CategoryPostCard from '../../../components/ui/category-post/card'
import CategoryIcon from '../../../components/ui/category-post/icon'
import SelectCategoriesDrawer from '../../../components/ui/select-categories-drawer'
import storage from '../../../config/storage'
import { categoryPageActions } from '../../../data/actions'
import usePageTitle from '../../../hooks/page-title.hook'
import Layout from '../../../layouts/home.layout'
import css from '../../../styles/categories-page.module.scss'

import type { storeType } from '../../../types'

const CategoriesPostViewPage = () => {
  const [
    dispatch,
    {
      navbar: { autoHide },
      categoryPageState: { currentCategory }
    },
    router
  ] = [useDispatch(), useSelector((state: storeType) => state), useRouter()]

  const { data: profile } = useGetProfile((router.query.username || '').toString(), false)

  const { data: categories } = useGetOwnedCategories(profile?.username || '')

  const trigger = useScrollTrigger({ target: undefined })

  usePageTitle({ title: 'General Posts' })

  useLayoutEffect(() => {
    if (!currentCategory) {
      const category = storage.session.get('current-category')

      if (!!category?.id) dispatch(categoryPageActions.setCurrentCategory(category.id))
      else {
        const categoryId = (categories?.find(({ priority }) => priority === 1) || { category: { _id: '' } })
          .category._id

        dispatch(categoryPageActions.setCurrentCategory(categoryId))
        storage.session.add({ key: 'current-category', value: { id: categoryId } })
      }
    }
  }, [categories, currentCategory, dispatch])

  const { data, isLoading } = useFetchPostByCategory({
    categoryId: currentCategory,
    username: profile?.username || ''
  })

  const openSelectCategory = () => dispatch(categoryPageActions.openSelectMenu())

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  useLayoutEffect(() => {
    if (isDesktop) router.replace('/profile/categories/posts')
  }, [isDesktop, router])

  useLayoutEffect(() => {
    if (!currentCategory) {
      const category = storage.session.get('current-category')

      if (!!category?.id) dispatch(categoryPageActions.setCurrentCategory(category.id))
      else {
        const categoryId = (categories?.find(({ priority }) => priority === 1) || { category: { _id: '' } })
          .category._id

        dispatch(categoryPageActions.setCurrentCategory(categoryId))
        storage.session.add({ key: 'current-category', value: { id: categoryId } })
      }
    }
  }, [categories, currentCategory, dispatch])

  useEffect(() => {
    const postId = router.query?.postId

    if (!!postId) {
      const post = document.getElementById(postId.toString())
      if (!!post) {
        const headerOffset = 80
        const postPosition = post.getBoundingClientRect().top
        const offsetPosition = postPosition + window.pageYOffset - headerOffset
        window.scrollTo({ top: offsetPosition, behavior: 'auto' })
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }, [router.query?.postId])

  const priority = categories?.find(category => category.category._id === currentCategory)?.priority || 0

  return (
    <div className={css.page_root_wrapper}>
      <div className={css['mobile-wrapper']}>
        {isLoading || !data ? (
          Array.from(Array(10).keys()).map(i => (
            <Skeleton
              key={`loading-indicator-no-${i}`}
              variant="rectangular"
              animation="wave"
              height="65vh"
              style={{ borderRadius: 10 }}
            />
          ))
        ) : data.length === 0 ? (
          <div>
            <p style={{ textAlign: 'center' }}>No Posts in this category</p>
          </div>
        ) : (
          data.map(post => <CategoryPostCard key={'post-' + post._id} {...post} priority={priority} />)
        )}
      </div>
      <Fab
        className={`${css.fab} ${(trigger && autoHide) || css.show_fab}`}
        variant={trigger && autoHide ? 'circular' : 'extended'}
        color="primary"
        aria-label="select-category"
        onClick={openSelectCategory}
      >
        <CategoryIcon
          className={css.img}
          categoryId={`${categories?.find(({ category }) => category._id === currentCategory)?.category._id}`}
          src={`${categories?.find(({ category }) => category._id === currentCategory)?.category.src}`}
        />
        {(trigger && autoHide) || (
          <span>
            &nbsp;&nbsp;{categories?.find(({ category }) => category._id === currentCategory)?.category.name}
          </span>
        )}
      </Fab>
      <Toolbar />
      <div style={{ height: '1.5rem' }} />
      {!categories || <SelectCategoriesDrawer categories={categories} />}
    </div>
  )
}

CategoriesPostViewPage.Layout = Layout

export default CategoriesPostViewPage
