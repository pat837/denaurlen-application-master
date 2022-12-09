import { ButtonBase, Skeleton } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

import profileService, { useGetBalance } from '../../../api-routes/Profile'
import { AuthContext } from '../../../contexts/auth.context'
import useToastMessage from '../../../hooks/toast-message.hook'
import { userType } from '../../../types'
import { Category_ } from '../../../types/category-post.type'
import { numberFormat as format } from '../../../utils'
import CoinsIcon2 from '../../icons/coins2.icon'
import Button from '../../ui/button'
import CategoryIcon from '../../ui/category-post/icon'
import ConditionalRender from '../../ui/conditional-render'
import Logo from '../../ui/logo'
import Popup from '../../ui/popup'
import css from './set-categories.module.scss'

type SetCategoriesScreenProps_ = {
  user: userType
  categories: Category_[]
}

const TOP10_REWARD = 2000

const SetCategoriesScreen = ({ user, categories }: SetCategoriesScreenProps_) => {
  const [router, { setUser }] = [useRouter(), useContext(AuthContext)]
  const { data, isLoading } = useGetBalance(user.username, true)
  const showToast = useToastMessage()

  const [{ selectedCategories, isSubmitting, openPopup }, setState] = useState<{
    selectedCategories: string[]
    isSubmitting: boolean
    openPopup: boolean
  }>({
    selectedCategories: [],
    isSubmitting: false,
    openPopup: false
  })

  const handleSelect = (categoryId: string) => () => {
    const index = selectedCategories.indexOf(categoryId)

    if (index === -1 && selectedCategories.length === 10) {
      if ('vibrate' in navigator) navigator?.vibrate(100)
      return showToast('You can select only 10 categories.')
    }

    setState(state => ({
      ...state,
      selectedCategories:
        index === -1 ? [...selectedCategories, categoryId] : selectedCategories.filter(c => c !== categoryId)
    }))
  }

  const openPopupHandler = () => setState(state => ({ ...state, openPopup: true }))

  const done = () => {
    setUser({ ...user, categories: 10 })
    router.push('/profile')
  }

  const handleCategoriesSubmit = () => {
    if (selectedCategories.length < 10) return showToast('Select 10 categories to continue')

    setState(state => ({ ...state, isSubmitting: true }))

    profileService
      .setCategories(
        selectedCategories.map((category, index) => ({
          category,
          priority: index + 1
        }))
      )
      .then(openPopupHandler)
      .catch(({ response }) => {
        showToast(response?.data?.message || 'Something went wrong')
        setState(state => ({ ...state, isSubmitting: false }))
      })
  }

  return (
    <div className={css.page}>
      <div className={css.header}>
        <header>
          <Logo />
          <ButtonBase className={css.button}>
            <CoinsIcon2 />
            {(isLoading && 'Loading') || format((data?.balance || 0) + TOP10_REWARD * selectedCategories.length)}
          </ButtonBase>
        </header>
      </div>
      <div className={css.wrapper}>
        <div className={css.headline}>
          <h3>
            Hey {user.username}, Choose Your Favorite <span>Top#10 Categories</span>
          </h3>
        </div>
        <div className={css.categories}>
          <ConditionalRender condition={false}>
            <>
              {Array.from(Array(45).keys()).map(index => (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  style={{ aspectRatio: '1 / 1', borderRadius: 10 }}
                  animation="wave"
                  key={`category-loader-${index}`}
                />
              ))}
            </>
            <>
              {categories?.map(({ _id, name, src }) => {
                const index = selectedCategories.indexOf(_id) + 1

                return (
                  <ButtonBase
                    key={_id}
                    className={`${css.category_card} ${index === 0 ? '' : css.selected}`}
                    onClick={handleSelect(_id)}
                  >
                    {/* <span className={css.priority}></span> */}
                    <input type="checkbox" name={name} id={_id} value={_id} hidden />
                    <label htmlFor={_id}>
                      <CategoryIcon className={css.image} categoryId={_id} src={src} />
                      <p className={css.label}>{name}</p>
                    </label>
                  </ButtonBase>
                )
              })}
            </>
          </ConditionalRender>
        </div>
      </div>
      <footer className={css.footer}>
        <Button
          label={`next (${selectedCategories.length}/10)`}
          loading={isSubmitting}
          onClick={handleCategoriesSubmit}
        />
      </footer>
      <Popup open={openPopup} onClose={done}>
        <div className={css.welcome_popup}>
          <h3>Welcome to DENAURLEN</h3>
          <p>
            This release is in preview. Features are noted as beta, pilot, or developer preview. This Beta Version
            does not represent the final stable version.
          </p>
          <span>
            For any feedbacks or suggestion you can navigate to feedbacks section in application settings.
          </span>
          <Button label="Lets get started" onClick={done} />
        </div>
      </Popup>
    </div>
  )
}

export { SetCategoriesScreen }
