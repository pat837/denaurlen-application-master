import { ButtonBase, Menu, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { arrayMove, List, OnChangeMeta } from 'react-movable'
import { useDispatch } from 'react-redux'

import profileService from '../../../api-routes/Profile'
import MoreHorizontalIcon from '../../../components/icons/more-horizontal.icon'
import ReorderIcon from '../../../components/icons/reorder.icon'
import UpdateCategoryScreen from '../../../components/screens/update-category.screen'
import Button from '../../../components/ui/button'
import CategoryIcon from '../../../components/ui/category-post/icon'
import ConditionalRender from '../../../components/ui/conditional-render'
import Popup from '../../../components/ui/popup'
import { ProfileContext } from '../../../contexts/profile.context'
import { categoryPageActions } from '../../../data/actions'
import usePageTitle from '../../../hooks/page-title.hook'
import useToastMessage from '../../../hooks/toast-message.hook'
import HomeLayout from '../../../layouts/home.layout'
import css from '../../../styles/pages/categories.module.scss'

import type { categoryType } from '../../../types'

const CategoriesPage = () => {
  const { categories, refetchProfile } = useContext(ProfileContext)
  const dispatch = useDispatch()
  const router = useRouter()
  const showToast = useToastMessage()

  usePageTitle({})

  const [{ viewEdit, categoriesOrder, isSubmitting, currentCategory }, setState] = useState({
    viewEdit: false,
    categoriesOrder: categories.map(({ category }) => category),
    isSubmitting: false,
    currentCategory: { _id: '', name: '', src: '', priority: 0 } as categoryType & {
      priority: number
    }
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onReorderClick = () => {
    handleClose()
    setState(state => ({ ...state, viewEdit: true }))
  }

  const onCancel = () => {
    setState({
      viewEdit: false,
      categoriesOrder: categories.map(({ category }) => category),
      isSubmitting: false,
      currentCategory: { _id: '', src: '', name: '', priority: 0 }
    })
  }
  const saveHandler = () => {
    setState(state => ({
      ...state,
      isSubmitting: true
    }))
    profileService
      .setCategories(categoriesOrder.map(({ _id }, inx) => ({ category: _id, priority: inx + 1 })))
      .then(() => {
        refetchProfile()
        setState(state => ({ ...state, isSubmitting: false, viewEdit: false }))
        showToast('Categories are updated')
        router.replace('/profile/categories')
      })
      .catch(() => showToast('Unable to update categories, try later'))
  }

  const gotoPostsHandler = () => {
    dispatch(categoryPageActions.setCurrentCategory(currentCategory._id))
    router.replace('/profile/categories/posts')
  }

  const openPopup = (category: categoryType & { priority: number }) => () => {
    setState(s => ({ ...s, currentCategory: category }))
    router.push({ pathname: router.pathname, query: { popup: 'category' } }, undefined, {
      shallow: true
    })
  }

  const onUpdateCategories = () => {
    router.replace({ pathname: router.pathname, query: { popup: 'update' } }, undefined, {
      shallow: true
    })
  }

  const closePopup = () => router.back()

  const changeHandler = ({ oldIndex, newIndex }: OnChangeMeta) => {
    setState(state => ({
      ...state,
      categoriesOrder: arrayMove(categoriesOrder, oldIndex, newIndex)
    }))
  }

  return (
    <div className={css.page_wrapper}>
      <ConditionalRender condition={viewEdit}>
        <div className={css.page}>
          <div className={`${css.heading} ${css.edit}`}>
            <div>
              <span>Re-arrange your</span>
              <h2>Categories</h2>
            </div>
            <div className={css.button_wrapper}>
              <Button label="save" loading={isSubmitting} onClick={saveHandler} />
              <Button label="cancel" variant="contained" onClick={onCancel} />
            </div>
          </div>
          <div className={css.edit_view_wrapper}>
            <List
              values={categoriesOrder}
              onChange={changeHandler}
              renderList={({ children, props }) => (
                <ul {...props} className={css.list_wrapper}>
                  {children}
                </ul>
              )}
              renderItem={({ value, props }) => {
                return (
                  <li {...props} className={css.list_item}>
                    <div className={css.list_item_wrapper}>
                      <CategoryIcon categoryId={value._id} src={value.src} />
                      <p>{value.name}</p>
                      <span className={css.dragger}>::</span>
                    </div>
                  </li>
                )
              }}
            />
          </div>
        </div>

        <div className={css.page}>
          <div className={css.heading}>
            <div>
              <span>Your #top 10</span>
              <h2>Categories</h2>
            </div>
            <ButtonBase
              className={css.button}
              aria-label="reorder"
              id="options-button"
              aria-controls={open ? 'options-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreHorizontalIcon />
            </ButtonBase>
            <Menu
              id="options-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'options-button'
              }}
            >
              <MenuItem onClick={onReorderClick}>
                <ReorderIcon />
                <span>&nbsp;&nbsp;Reorder&nbsp;</span>
              </MenuItem>
            </Menu>
          </div>
          <div className={css.card_wrapper}>
            <span className={css.fix} />
            {categories
              .sort((a, b) => a.priority - b.priority)
              .map(({ _id, category, priority }) => (
                <ButtonBase key={_id} className={css.card} onClick={openPopup({ ...category, priority })}>
                  <CategoryIcon className={css.icon} categoryId={category._id} src={category.src} />
                  <span className={css.label}>
                    <span>{priority}</span>
                    {category.name}
                  </span>
                </ButtonBase>
              ))}
          </div>
        </div>
      </ConditionalRender>
      <Popup open={router.query?.popup === 'category'} onClose={closePopup}>
        <div className={css.popup}>
          <div className={css.category_section}>
            <CategoryIcon src={currentCategory.src} categoryId={currentCategory._id} />
            <div className={css.category_name}>
              <span>
                {currentCategory.priority < 10 ? 0 : ''}
                {currentCategory.priority}
              </span>
              <p>{currentCategory.name}</p>
            </div>
          </div>
          <div className={css.button_wrapper}>
            <Button label="replace" variant="outline" onClick={onUpdateCategories} />
            <Button label="view posts" onClick={gotoPostsHandler} />
          </div>
        </div>
      </Popup>
      <Popup open={router.query?.popup === 'update'} onClose={closePopup}>
        {!currentCategory._id || <UpdateCategoryScreen currentCategory={currentCategory} />}
      </Popup>
    </div>
  )
}

CategoriesPage.Layout = HomeLayout

export default CategoriesPage
