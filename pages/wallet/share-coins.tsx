import { useMediaQuery } from '@mui/material'
import router from 'next/router'
import { ChangeEvent, Fragment, useState } from 'react'

import useGetTodaysLimit from '../../api-routes/transactions/fetch-todays-limit'
import useFetchCardUser from '../../api-routes/transactions/get-card-users'
import useShareCoins from '../../api-routes/transactions/share-coins'
import XFilledIcon from '../../components/icons/x-filled.icon'
import Avatar from '../../components/ui/avatar'
import Button from '../../components/ui/button'
import ConditionalRender from '../../components/ui/conditional-render'
import HideOnScroll from '../../components/ui/hide-on-scroll'
import Popup from '../../components/ui/popup'
import RadioButton from '../../components/ui/radio-button'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import usePageTitle from '../../hooks/page-title.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/share-coins.page.module.scss'
import { PostUploader_ } from '../../types'

type Profile_ = PostUploader_ & { name: string }

const ShareCoinsPage = () => {
  const isDesktop = useMediaQuery('(min-width:1080px)')
  const showToast = useToastMessage()

  usePageTitle({ title: 'Share Coins' })

  const [{ isOpenSharePopup, currentProfile, note, amount, isConfirmOpen, pin }, setState] = useState({
    isOpenSharePopup: false,
    currentProfile: {} as Profile_,
    note: '',
    amount: 0,
    isConfirmOpen: false,
    pin: ''
  })

  const [search, setSearch] = useState('')

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useFetchCardUser(search)
  const { data: limit } = useGetTodaysLimit()

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value as string)
  const clearSearch = () => setSearch('')

  const nextPageRef = useFetchNextPage({
    fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false
  })

  const closeSharePopup = () => setState(state => ({ ...state, isOpenSharePopup: false, amount: 0, note: '' }))

  const closeConfirmPopup = () => setState(state => ({ ...state, isConfirmOpen: false, pin: '' }))

  const handleShare = (profile: Profile_) => () => {
    setState(state => ({ ...state, isOpenSharePopup: true, currentProfile: profile }))
  }

  const changeNoteHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setState(state => ({ ...state, note: e.target.value }))
  }
  const changePinHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const p = e.target.value

    if (p.length < 5) setState(state => ({ ...state, pin: p }))
  }

  const radioHandler = (e: any) => {
    setState(cur => ({
      ...cur,
      amount: e.target.value
    }))
  }

  const confirmHandler = () => {
    if (amount <= 0) return null
    if (amount > (limit || 0)) return showToast('Limit exceeded')
    setState(state => ({ ...state, isConfirmOpen: true }))
  }

  const { mutate, isLoading: isSharing } = useShareCoins()

  const handleShareCoins = () => {
    if (!pin) return null
    mutate(
      { cr_account: currentProfile._id, dens: amount, inputPin: pin, memo: note },
      {
        onError: (error: any, _variables, _context) => {
          setState(s => ({ ...s, pin: '' }))
          showToast(error?.response?.data?.message || 'Something went wrong')
        },
        onSuccess: () => {
          setState({
            isOpenSharePopup: false,
            currentProfile: {} as Profile_,
            note: '',
            amount: 0,
            isConfirmOpen: false,
            pin: ''
          })
          router.back()
        }
      }
    )
  }

  const Wrapper = isDesktop ? Fragment : HideOnScroll

  return (
    <div className={css.page}>
      <Wrapper>
        <div className={css.search_section}>
          <div className={css.fix} />
          <div className={css.search_wrapper}>
            <div className={css.input_wrapper}>
              <input placeholder="Search..." value={search} onChange={inputHandler} />
              <div className={`${css.clear_wrapper} ${!search || css.show}`} onClick={clearSearch}>
                <XFilledIcon />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
      <section>
        <ConditionalRender condition={isLoading}>
          <div className={css.message}>Loading...</div>
          <div>
            <ConditionalRender condition={!data?.pages?.[0]?.length}>
              <div className={css.message}>No Profiles</div>
              <div className={css.profile_section}>
                {data?.pages.map((page, pageNo) => {
                  const isLastPage = data.pages.length === pageNo + 1

                  return page.map(({ _id, profilePic, username, name }, index) => (
                    <div
                      className={css.profile_card}
                      key={_id}
                      ref={isLastPage && index === 15 ? nextPageRef : undefined}
                    >
                      <Avatar className={css.profile_pic} url={profilePic} alt={username} />
                      <div className={css.name_section}>
                        <span>{username}</span>
                        <span>{name}</span>
                      </div>
                      <Button
                        label="share"
                        variant="outline"
                        onClick={handleShare({ _id, name, profilePic, username })}
                      />
                    </div>
                  ))
                })}
              </div>
            </ConditionalRender>
          </div>
        </ConditionalRender>
      </section>
      <Popup open={isOpenSharePopup} onClose={closeSharePopup}>
        <ConditionalRender condition={!currentProfile._id}>
          <></>
          <div className={css.share_popup}>
            <Avatar className={css.avatar} url={currentProfile.profilePic} alt={currentProfile.username} />
            <span className={css.username}>{currentProfile.username}</span>
            <span className={css.name}>{currentProfile.name}</span>
            <div className={css.amount_wrapper}>
              <RadioButton label="100" name="coins" value={100} onChange={radioHandler} />
              <RadioButton label="200" name="coins" value={200} onChange={radioHandler} />
              <RadioButton label="500" name="coins" value={500} onChange={radioHandler} />
              <RadioButton label="1000" name="coins" value={1000} onChange={radioHandler} />
              <RadioButton label="2000" name="coins" value={2000} onChange={radioHandler} />
              <RadioButton label="5000" name="coins" value={5000} onChange={radioHandler} />
            </div>
            <input
              style={{ width: `${10 * note.length}px` }}
              value={note}
              onChange={changeNoteHandler}
              className={css.note}
              placeholder="Add a note"
            />
            <Button label="share" onClick={confirmHandler} />
          </div>
        </ConditionalRender>
      </Popup>
      <Popup open={isConfirmOpen} onClose={closeConfirmPopup}>
        <ConditionalRender condition={!currentProfile._id}>
          <></>
          <div className={css.share_popup}>
            <h3>Confirm Pin</h3>
            <input
              autoFocus
              value={pin}
              type="password"
              pattern="[0-9]"
              inputMode="numeric"
              onChange={changePinHandler}
              className={css.coins}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                width: '100%',
                gap: '1rem',
                maxWidth: 270
              }}
            >
              <Button
                label="cancel"
                variant="contained"
                onClick={() => {
                  closeConfirmPopup()
                  closeSharePopup()
                }}
              />
              <Button label="share" loading={isSharing} onClick={handleShareCoins} />
            </div>
          </div>
        </ConditionalRender>
      </Popup>
    </div>
  )
}

ShareCoinsPage.Layout = HomeLayout

export default ShareCoinsPage
