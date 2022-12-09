import { ButtonBase, Skeleton } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

import useGetCategories from '../../api-routes/categories/get-owned-categories'
import profileQueries from '../../api-routes/profile-queries/profile.routes'
import useFetchSwapCard from '../../api-routes/profile-queries/swap-card'
import useFetchUnselectedCategories from '../../api-routes/profile-queries/unselected-categories'
import { ProfileContext } from '../../contexts/profile.context'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import css from '../../styles/pages/categories.module.scss'
import ChevronsRightIcon from '../icons/chevrons-right.icon'
import SwapIcon from '../icons/swap.icon'
import Button from '../ui/button'
import CategoryIcon from '../ui/category-post/icon'
import Popup from '../ui/popup'

import type { categoryType } from '../../types'
type UpdateCategoryScreenProps_ = {
  currentCategory: {
    priority: number
  } & categoryType
}

type ConfirmPopupProps_ = {
  currentCategory: categoryType
  newCategory: categoryType
  open: boolean
  onClose: () => void
}

const UpdateCategoryScreen = ({ currentCategory }: UpdateCategoryScreenProps_) => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useFetchUnselectedCategories()

  const [{ newCategory }, setState] = useState({
    newCategory: {} as categoryType
  })

  const selectCategory = (newCategory: categoryType) => () => {
    setState(s => ({ ...s, newCategory }))
  }

  const deselectCategory = () => setState(s => ({ ...s, newCategory: {} as categoryType }))

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  return (
    <div className={css.update_wrapper}>
      <h3>Select Category</h3>
      <div className={css.wrap}>
        {isLoading
          ? Array.from(Array(24).keys()).map(index => (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                style={{ aspectRatio: '1 / 1', borderRadius: 10 }}
                animation="wave"
                key={`category-loader-${index}`}
              />
            ))
          : data?.pages.map((page, pageNo) => {
              const isLastPage = data.pages.length === pageNo + 1

              return page.map(({ _id, name, src }, indx) => (
                <ButtonBase
                  key={_id}
                  className={css.card}
                  ref={isLastPage && indx === 10 ? nextPageTrigger : undefined}
                  onClick={selectCategory({ _id, name, src })}
                >
                  <CategoryIcon className={css.icon} categoryId={_id} src={src} />
                  <span className={css.label}>{name}</span>
                </ButtonBase>
              ))
            })}
      </div>
      <ConfirmPopup
        newCategory={newCategory}
        currentCategory={{
          _id: currentCategory._id,
          name: currentCategory.name,
          src: currentCategory.src
        }}
        onClose={deselectCategory}
        open={!!newCategory?._id}
      />
    </div>
  )
}

const ConfirmPopup = ({ newCategory, currentCategory, onClose, open }: ConfirmPopupProps_) => {
  const { profile, categories } = useContext(ProfileContext)
  const { data } = useFetchSwapCard()
  const { refetch } = useGetCategories(profile.username, true)
  const [loading, setLoading] = useState(false)
  const showToast = useToastMessage()
  const router = useRouter()

  const onCategorySwap = () => {
    setLoading(true)
    profileQueries
      .swapCategory({
        cardId: data?._id || '',
        currentCategory: currentCategory._id,
        newCategory: newCategory._id,
        categories: categories.map(({ category, priority }) => ({
          category: category._id === currentCategory._id ? newCategory._id : category._id,
          priority
        }))
      })
      .then(e => {
        refetch().then(() => {
          setLoading(false)
          router.replace('/profile/categories')
        })
      })
      .catch(() => {
        setLoading(false)
        showToast('Unable to swap, try later')
      })
  }

  return (
    <Popup open={open} onClose={onClose}>
      <div className={css.confirm_popup_wrapper}>
        <div className={css.confirm_popup}>
          <div className={css.preview_section}>
            <div className={css.category_icon}>
              <CategoryIcon src={currentCategory.src} categoryId={currentCategory._id} />
              <span>{currentCategory.name}</span>
            </div>
            <ChevronsRightIcon />
            <div className={css.category_icon}>
              <CategoryIcon src={newCategory.src} categoryId={newCategory._id} />
              <span>{newCategory.name}</span>
            </div>
          </div>
          <div className={css.coupon}>
            <div className={css.details}>
              <h5>
                <span>Category</span>Swap-Card
              </h5>
              <span>Use this card to change category</span>
            </div>
            <div className={css.icon}>
              <SwapIcon />
            </div>
          </div>
          <p>
            <span>
              You have <b>{data?.cardCount || 0}</b> swap-card{(data?.cardCount || 0) > 1 && 's'}
            </span>
            {!data?.cardCount
              ? 'You need to have swap-card to change category'
              : 'Swap-card will be used to change category'}
          </p>
          <div className={css.button_wrapper}>
            <Button label="cancel" variant="contained" onClick={onClose} />
            <Button label="swap" loading={loading} disabled={!data?.cardCount} onClick={onCategorySwap} />
          </div>
        </div>
      </div>
    </Popup>
  )
}

export default UpdateCategoryScreen
