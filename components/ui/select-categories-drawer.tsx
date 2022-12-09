import { ButtonBase, Drawer, IconButton } from '@mui/material'
import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import storage from '../../config/storage'
import { categoryPageActions } from '../../data/actions'
import css from '../../styles/components/ui/select-categories-drawer.module.scss'
import XIcon from '../icons/x.icon'

import type { categoriesListType, storeType } from '../../types'
import CategoryIcon from './category-post/icon'
const SelectCategoriesDrawer = ({ categories }: { categories: categoriesListType }) => {
  const [dispatch, { currentCategory, openSelectCategory }] = [
    useDispatch(),
    useSelector((store: storeType) => store.categoryPageState)
  ]

  const closeHandler = () => dispatch(categoryPageActions.closeSelectMenu())

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const categoryId = event.target.value as string

    dispatch(categoryPageActions.setCurrentCategory(categoryId))
    storage.session.add({ key: 'current-category', value: { id: categoryId } })

    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <Drawer
      open={openSelectCategory}
      anchor="bottom"
      onClose={closeHandler}
      classes={{
        paper: css.drawer,
        root: css.drawer_backdrop
      }}
    >
      <div className={css.container}>
        <span className={css.handle} onClick={closeHandler} />
        <div className={css.wrapper}>
          {categories.map(({ _id, category, priority }) => (
            <ButtonBase className={css.category_wrapper} key={_id}>
              <input
                type="radio"
                onClick={closeHandler}
                name="current-category"
                onChange={changeHandler}
                checked={category._id === currentCategory}
                value={category._id}
                id={category._id}
              />
              <label htmlFor={category._id}>
                <CategoryIcon className={css.img} src={category.src} categoryId={category._id} />
                <span>
                  {priority}. {category.name}
                </span>
              </label>
            </ButtonBase>
          ))}
        </div>
        <div className={css.header}>
          <h4>Categories</h4>
          <IconButton aria-label="close" edge="end" onClick={closeHandler}>
            <XIcon />
          </IconButton>
        </div>
      </div>
    </Drawer>
  )
}

export default SelectCategoriesDrawer
