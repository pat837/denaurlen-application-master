import { ButtonBase } from '@mui/material'
import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import storage from '../../config/storage'
import { categoryPageActions } from '../../data/actions'
import css from '../../styles/components/ui/select-categories-capsule.module.scss'
import { categoriesListType, storeType } from '../../types'
import CategoryIcon from './category-post/icon'

const SelectCategoriesCapsule = ({ categories }: { categories: categoriesListType }) => {
  const [dispatch, { currentCategory }] = [
    useDispatch(),
    useSelector((store: storeType) => store.categoryPageState)
  ]

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const categoryId = event.target.value as string

    dispatch(categoryPageActions.setCurrentCategory(categoryId))
    storage.session.add({ key: 'current-category', value: { id: categoryId } })
  }

  return (
    <>
      <div className={css.container}>
        <div className={css.wrapper}>
          {categories.map(({ _id, category, priority }) => (
            <ButtonBase className={css.category_wrapper} key={_id}>
              <input
                type="radio"
                name="current-category-capsule"
                onChange={changeHandler}
                checked={category._id === currentCategory}
                value={category._id}
                id={category._id}
              />
              <label htmlFor={category._id}>
                <CategoryIcon className={css.img} categoryId={category._id} src={category.src} />
                <span>
                  {priority}. {category.name}
                </span>
              </label>
            </ButtonBase>
          ))}
        </div>
      </div>
      <div className={css.fix} />
    </>
  )
}

export default SelectCategoriesCapsule
