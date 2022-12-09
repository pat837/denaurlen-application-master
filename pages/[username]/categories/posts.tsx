import { Fab, Skeleton, Toolbar, useMediaQuery, useScrollTrigger } from '@mui/material'
import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useGetOwnedCategories from '../../../api-routes/categories/get-owned-categories'
import useFetchPostByCategory from '../../../api-routes/posts/category/fetch-by-category'
import useGetProfile from '../../../api-routes/profile-queries/fetch-profile'
import CategoryPostPopup from '../../../components/popups/category-post/category-popup'
import { CategoryPostPreviewCard, EmptyCategoryPostPreviewCard } from '../../../components/ui/category-post-card'
import CategoryIcon from '../../../components/ui/category-post/icon'
import ConditionalRender from '../../../components/ui/conditional-render'
import SelectCategoriesCapsule from '../../../components/ui/select-categories-capsule'
import SelectCategoriesDrawer from '../../../components/ui/select-categories-drawer'
import storage from '../../../config/storage'
import { categoryPageActions } from '../../../data/actions'
import usePageTitle from '../../../hooks/page-title.hook'
import usePopup from '../../../hooks/popup.hook'
import Layout from '../../../layouts/home.layout'
import css from '../../../styles/categories-page.module.scss'

import type { storeType } from '../../../types'

const CategoriesPostPage = () => {
  const [
    dispatch,
    isDesktop,
    {
      navbar: { autoHide },
      categoryPageState: { currentCategory }
    },
    router,
    { openPopup }
  ] = [
    useDispatch(),
    useMediaQuery('(min-width: 1024px)'),
    useSelector((state: storeType) => state),
    useRouter(),
    usePopup()
  ]

  const { data: profile } = useGetProfile((router.query.username || '').toString(), false)

  const { data: categories } = useGetOwnedCategories(profile?.username || '')

  const trigger = useScrollTrigger({ target: undefined })

  usePageTitle({ title: 'Top 10 Posts' })

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

  const clickHandler = (postId: string) => () => {
    if (isDesktop)
      openPopup('category-post-popup', { params: { post: data?.findIndex(post => post._id === postId) } })
    else router.push({ pathname: `/${profile?.username}/categories/views`, query: { postId } })
  }

  const openSelectCategory = () => dispatch(categoryPageActions.openSelectMenu())

  return (
    <div className={css.page_wrapper}>
      <ConditionalRender condition={isDesktop}>
        {!categories || <SelectCategoriesCapsule categories={categories} />}
        <div style={{ height: '1rem' }} />
      </ConditionalRender>
      <div className={css['desktop-wrapper']}>
        {isLoading || !data
          ? Array.from(Array(10).keys()).map(i => (
              <Skeleton
                key={`loading-indicator-no-${i}`}
                variant="rectangular"
                animation="wave"
                width="100%"
                height="100%"
                style={{ borderRadius: 10, aspectRatio: '8 / 10' }}
              />
            ))
          : Array.from(Array(10).keys()).map(index => {
              const slot = index + 1
              const post = data.find(post => post.slot === slot)

              if (post === undefined)
                return (
                  <EmptyCategoryPostPreviewCard
                    key={`no-post-${index}`}
                    categoryId={currentCategory}
                    slotNo={slot}
                  />
                )

              return (
                <CategoryPostPreviewCard
                  key={`${post._id}-${index}`}
                  src={post.src[0]}
                  slotNo={post.slot}
                  title={post.title}
                  onClick={clickHandler(post._id)}
                />
              )
            })}
      </div>
      {isDesktop || (
        <>
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
        </>
      )}
      {!data || !data.length || <CategoryPostPopup data={data} />}
    </div>
  )
}

CategoriesPostPage.Layout = Layout

export default CategoriesPostPage
