import { Card, CardContent, IconButton, Menu, MenuItem, Typography, useScrollTrigger } from '@mui/material'
import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useGetBios from '../../api-routes/bio/fetch-all-bios'
import useGetActiveBio from '../../api-routes/bio/get-active-bio'
import useGetOwnedBios from '../../api-routes/bio/get-owned-bios'
import useSetBio from '../../api-routes/bio/select-bio'
import useUnlockAndSelect from '../../api-routes/bio/unlock-and-select-bio'
import useSelectBio from '../../api-routes/bio/unlock-bio'
import ChevronUpIcon from '../../components/icons/chevron-up.icon'
import CoinsIcon2 from '../../components/icons/coins2.icon'
import MoreVerticalIcon from '../../components/icons/more-vertical.icon'
import XIcon from '../../components/icons/x.icon'
import Button from '../../components/ui/button'
import Checkbox from '../../components/ui/checkbox'
import DotLoader from '../../components/ui/dot-loader'
import Image from '../../components/ui/picture'
import Popup from '../../components/ui/popup'
import { BioActions } from '../../data/actions'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import useInViewport from '../../hooks/in-viewport.hook'
import usePageTitle from '../../hooks/page-title.hook'
import useSearchBios from '../../hooks/search-bio.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import HomeLayout from '../../layouts/home.layout'
import { numberFormat } from '../../utils'
import { getMediaURL } from '../../utils/get-url'
import css from './../../styles/pages/bio-page.module.scss'

import type { storeType } from '../../types'

type Bio_ = {
  _id: string
  name: string
  src: string
  meaning: string
  price: number
}

const BioPage = () => {
  const [
    dispatch,
    {
      bioState: { biosToShow },
      navbar: { autoHide }
    }
  ] = [useDispatch(), useSelector((store: storeType) => store)]
  const [search, setSearch] = useState('')
  const headSection = useInViewport({})
  const trigger = useScrollTrigger({ target: undefined })

  const clearSearch = () => setSearch('')

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value === 'ALL' || value === 'OWNED') {
      dispatch(BioActions.bioToShow(value))
      clearSearch()
    }
  }

  const handleScrollToTop = () => {
    if (headSection.isVisible || (trigger && autoHide)) return null
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const bios = {
    ALL: <AllBios />,
    OWNED: <OwnedBios />
  }
  const searchBios = {
    ALL: <AllBiosSearch searchedBio={search} />,
    OWNED: <OwnedBiosSearch searchedBio={search} />
  }

  usePageTitle({ title: 'Bios' })

  return (
    <div className={css.page_wrapper}>
      <div className={css.navigation_section} ref={headSection.ref}>
        <input
          type="radio"
          name="bios-tab"
          id="yours-bios"
          value="OWNED"
          checked={biosToShow === 'OWNED'}
          onChange={changeHandler}
        />
        <input
          type="radio"
          name="bios-tab"
          id="all-bios"
          value="ALL"
          checked={biosToShow === 'ALL'}
          onChange={changeHandler}
        />
        <nav className={biosToShow === 'ALL' ? css.all : css.your}>
          <label htmlFor="yours-bios">Your</label>
          <label htmlFor="all-bios">All</label>
        </nav>
        <div className={css.search_wrapper}>
          <input
            className={css.search}
            placeholder="Search..."
            type="text"
            name="bios-search"
            id="bios-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <XIcon className={`${css.clear} ${!search && css.hide}`} onClick={clearSearch} />
        </div>
      </div>
      {!search ? bios[biosToShow] : searchBios[biosToShow]}
      <div
        className={`${css.scroll_top} ${(headSection.isVisible || (trigger && autoHide)) && css.hide}`}
        onClick={handleScrollToTop}
      >
        <ChevronUpIcon />
      </div>
    </div>
  )
}

const AllBios = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetBios({ search: '' })

  const showToast = useToastMessage()

  const [{ currentBio, setBio }, setState] = useState<{ currentBio: Bio_; setBio: boolean }>({
    currentBio: { _id: '', meaning: '', name: '', price: 0, src: '' },
    setBio: true
  })

  const removeCurrentBio = () =>
    setState(state => ({
      ...state,
      currentBio: { _id: '', meaning: '', name: '', price: 0, src: '' }
    }))

  const handleSetBio = () => setState(s => ({ ...s, setBio: !setBio }))

  const selectHandler = (bio: Bio_) => () => setState(state => ({ ...state, currentBio: bio }))

  const { mutate: selectBio, isLoading: isSelecting } = useSelectBio({
    onError: () => {
      showToast('Something went wrong will unlocking bio')
    },
    onSuccess: () => {
      removeCurrentBio()
      showToast('Bio is unlocked')
    }
  })

  const { mutate: unlockAndSelect, isLoading: isUnlockingAndSelecting } = useUnlockAndSelect({
    onError: () => {
      showToast('Something went wrong will unlocking bio')
    },
    onSuccess: () => {
      removeCurrentBio()
      showToast('Bio is unlocked and selected')
    }
  })

  const unlockHandler = (id: string) => () => {
    if (setBio) unlockAndSelect(id)
    else selectBio(id)
  }

  const lastCardRef = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  if (isLoading)
    return (
      <div className={css.next_page_loader}>
        <DotLoader />
      </div>
    )

  return (
    <>
      <div className={css.bio_wrapper}>
        {data?.pages.map((page, index) => {
          const isLastPage = data.pages.length === index + 1

          if (page !== undefined)
            return page.map(({ _id, name, src, meaning, price }, index) => (
              <div key={_id} className={css.card_wrapper}>
                <Card className={css.card}>
                  <Image src={src} alt={name} height="240px" width="100%" />
                  <CardContent className={css.card_content}>
                    <Typography gutterBottom variant="h5" component="div" className={css.title}>
                      {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meaning}
                    </Typography>
                  </CardContent>
                  <div className={css.footer}>
                    <Button label="unlock" onClick={selectHandler({ _id, name, src, meaning, price })} />
                    <div className={css.price}>
                      <CoinsIcon2 />
                      <code>{numberFormat(price)}</code>
                    </div>
                  </div>
                </Card>
                {isLastPage &&
                  (page.length > 5
                    ? index === page.length - 5 && <span ref={lastCardRef} />
                    : index + 1 === page.length && <span ref={lastCardRef} />)}
              </div>
            ))
        })}
      </div>
      {isFetchingNextPage && (
        <div className={css.next_page_loader}>
          <DotLoader />
        </div>
      )}
      <Popup open={!!currentBio._id} onClose={removeCurrentBio}>
        <div className={css.confirm}>
          <div className={css.popup_wrapper}>
            <Typography variant="h4">Want to unlock this bio?</Typography>
            <div style={{ height: 8 }} />
            <Typography variant="body1">Coins will be deducted for unlocking bio</Typography>
            <div style={{ height: 8 }} />
            <Checkbox checked={setBio} label="Set as a bio" onChange={handleSetBio} />
            <div className={css.popup_btn}>
              <Button label="cancel" variant="contained" onClick={removeCurrentBio} />
              <Button
                label="unlock"
                loading={isSelecting || isUnlockingAndSelecting}
                onClick={unlockHandler(currentBio._id)}
              />
            </div>
          </div>
        </div>
      </Popup>
    </>
  )
}

const OwnedBios = () => {
  const [currentBio, setCurrentBio] = useState('')

  const [
    { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage },
    { data: activeBio, isLoading: isActiveBioLoading },
    dispatch,
    showToast
  ] = [useGetOwnedBios({ search: '', size: 20 }), useGetActiveBio(), useDispatch(), useToastMessage()]

  const onSuccess = (bioName: string) => {
    showToast(`${bioName} is selected`)
  }

  const onError = () => {
    showToast('Unable to select bio, please later')
  }

  const { mutate: selectBio, isLoading: isSubmitting } = useSetBio({ onSuccess, onError })
  const { mutate: deSelectBio, isLoading: isRemoving } = useSetBio({
    onSuccess: (bioName: string) => {
      setCurrentBio('')
      showToast(`${bioName} is unselected`)
      handleClose()
    },
    onError: () => {
      setCurrentBio('')
      showToast('Unable to unselect bio, please later')
      handleClose()
    },
    isUnSelect: true
  })
  const { mutate: revertBio, isLoading: isReverting } = useSelectBio({
    forUnSelect: true,
    onError: () => {
      setCurrentBio('')
      showToast('Unable to unselect bio, please later')
    },
    onSuccess: () => {
      setCurrentBio('')
      showToast('Bio is reverted')
    }
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Pagination code
  const observer = useRef<any>()
  const lastCardRef = useCallback(
    (node: any) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  const handleSelectBio = (bio: Bio_) => () => {
    setCurrentBio(bio._id)
    selectBio(bio)
  }

  if (isLoading || isActiveBioLoading || activeBio === undefined || data === undefined)
    return (
      <div className={css.next_page_loader}>
        <DotLoader />
      </div>
    )

  return (
    <div className={css.bio_container}>
      {!activeBio?._id || (
        <div
          className={css.active_bio_card}
          style={{ backgroundImage: `url('${getMediaURL(activeBio?.src || '')}')` }}
        >
          <div className={css.active_bio}>
            <div>
              <Typography gutterBottom variant="h5" component="div" className={css.title}>
                <p>{activeBio?.name}</p>
                <IconButton
                  edge="end"
                  id="active-bio-button"
                  aria-controls={open ? 'active-bio-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <MoreVerticalIcon />
                </IconButton>
                <Menu
                  id="active-bio-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'active-bio-button'
                  }}
                >
                  <MenuItem onClick={() => deSelectBio(activeBio)}>
                    {isRemoving ? 'Removing...' : 'Remove'}
                  </MenuItem>
                  {/* <MenuItem onClick={handleClose}>Revert</MenuItem> */}
                </Menu>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeBio?.meaning}&nbsp;&nbsp;{' '}
              </Typography>
            </div>
          </div>
        </div>
      )}
      <div className={css.bio_wrapper}>
        {data.pages[0].length > 0 &&
          data.pages.map((page, index) => {
            const isLastPage = data.pages.length === index + 1

            return page
              .filter(({ _id }) => _id !== activeBio._id)
              .map(({ _id, name, src, meaning, price }, index) => (
                <div key={_id} id={_id} className={css.card_wrapper}>
                  <Card className={css.card}>
                    <Image src={src} alt={name} height="240px" width="100%" />
                    <CardContent className={css.card_content}>
                      <Typography gutterBottom variant="h5" component="div" className={css.title}>
                        {name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {meaning}
                      </Typography>
                    </CardContent>
                    <div className={css.footer}>
                      <div>
                        <Button
                          label="revert"
                          variant="text"
                          loading={isReverting && _id === currentBio}
                          onClick={() => {
                            setCurrentBio(_id)
                            revertBio(_id)
                          }}
                        />
                        <Button
                          label="set"
                          loading={isSubmitting && _id === currentBio}
                          onClick={handleSelectBio({ _id, name, src, meaning, price })}
                        />
                      </div>
                      <div className={css.price}>
                        <CoinsIcon2 />
                        <code>{numberFormat(price)}</code>
                      </div>
                    </div>
                  </Card>
                  {isLastPage &&
                    (page.length > 5
                      ? index === page.length - 5 && <span ref={lastCardRef} />
                      : index + 1 === page.length && <span ref={lastCardRef} />)}
                </div>
              ))
          })}
      </div>
      {data.pages[0].length > 0 || (
        <div className={css.no_bios_wrapper}>
          <Typography variant="h4">You haven&apos;t unlocked any bio yet!</Typography>
          <div>
            <Button label="unlock bio" onClick={() => dispatch(BioActions.bioToShow('ALL'))} />
          </div>
        </div>
      )}
      {isFetchingNextPage && (
        <div className={css.next_page_loader}>
          <DotLoader />
        </div>
      )}
    </div>
  )
}

const OwnedBiosSearch = ({ searchedBio }: { searchedBio: string }) => {
  const [currentBio, setCurrentBio] = useState('')

  const [currentPage, setCurrentPage] = useState(1)

  const { bios, loading, hasMore } = useSearchBios({
    input: searchedBio,
    pageNumber: currentPage,
    size: 10,
    isOwnBio: true
  })

  const [{ data: activeBio }, showToast] = [useGetActiveBio(), useToastMessage()]

  const onSuccess = (bioName: string) => {
    showToast(`${bioName} is selected`)
  }

  const onError = () => {
    showToast('Unable to select bio, please later')
  }

  const { mutate: selectBio, isLoading: isSubmitting } = useSetBio({ onSuccess, onError })
  const { mutate: deSelectBio, isLoading: isRemoving } = useSetBio({
    onSuccess: (bioName: string) => {
      setCurrentBio('')
      showToast(`${bioName} is unselected`)
      handleClose()
    },
    onError: () => {
      setCurrentBio('')
      showToast('Unable to unselect bio, please later')
      handleClose()
    },
    isUnSelect: true
  })
  const { mutate: revertBio, isLoading: isReverting } = useSelectBio({
    forUnSelect: true,
    onError: () => {
      setCurrentBio('')
      showToast('Unable to unselect bio, please later')
    },
    onSuccess: () => {
      setCurrentBio('')
      showToast('Bio is reverted')
    }
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const lastCardRef = useFetchNextPage({
    fetchNextPage: () => setCurrentPage(currentPage + 1),
    hasNextPage: hasMore,
    isLoading: loading
  })

  const handleSelectBio = (bio: Bio_) => () => {
    setCurrentBio(bio._id)
    selectBio(bio)
  }

  return (
    <div className={css.bio_container}>
      {!activeBio?._id || (
        <div
          className={css.active_bio_card}
          style={{ backgroundImage: `url('${getMediaURL(activeBio?.src || '')}')` }}
        >
          <div className={css.active_bio}>
            <div>
              <Typography gutterBottom variant="h5" component="div" className={css.title}>
                <p>{activeBio?.name}</p>
                <IconButton
                  edge="end"
                  id="active-bio-button"
                  aria-controls={open ? 'active-bio-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <MoreVerticalIcon />
                </IconButton>
                <Menu
                  id="active-bio-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'active-bio-button'
                  }}
                >
                  <MenuItem onClick={() => deSelectBio(activeBio)}>
                    {isRemoving ? 'Removing...' : 'Remove'}
                  </MenuItem>
                  {/* <MenuItem onClick={handleClose}>Revert</MenuItem> */}
                </Menu>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeBio?.meaning}&nbsp;&nbsp;{' '}
              </Typography>
            </div>
          </div>
        </div>
      )}
      <div className={css.bio_wrapper}>
        {bios
          .filter(({ _id }) => _id !== activeBio?._id)
          .map(({ _id, name, src, meaning, price }, index) => (
            <div key={_id} className={css.card_wrapper}>
              <Card className={css.card}>
                <Image src={src} alt={name} height="240px" width="100%" />
                <CardContent className={css.card_content}>
                  <Typography gutterBottom variant="h5" component="div" className={css.title}>
                    {name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {meaning}
                  </Typography>
                </CardContent>
                <div className={css.footer}>
                  <div>
                    <Button
                      label="revert"
                      variant="text"
                      loading={isReverting && _id === currentBio}
                      onClick={() => {
                        setCurrentBio(_id)
                        revertBio(_id)
                      }}
                    />
                    <Button
                      label="set"
                      loading={isSubmitting && _id === currentBio}
                      onClick={handleSelectBio({ _id, name, src, meaning, price })}
                      className={css.buy}
                    />
                  </div>
                  <div className={css.price}>
                    <CoinsIcon2 />
                    <code>{numberFormat(price)}</code>
                  </div>
                </div>
              </Card>
              {bios.length === index + 1 && <span ref={lastCardRef} />}
            </div>
          ))}
      </div>
      {bios.length > 0 || <></>}
      {loading && (
        <div className={css.next_page_loader}>
          <DotLoader />
        </div>
      )}
    </div>
  )
}

const AllBiosSearch = ({ searchedBio }: { searchedBio: string }) => {
  const showToast = useToastMessage()

  const [{ currentBio, currentPage, setBio }, setState] = useState({
    currentBio: { _id: '', meaning: '', name: '', price: 0, src: '' },
    currentPage: 1,
    setBio: true
  })

  const { bios, loading, hasMore } = useSearchBios({
    input: searchedBio,
    pageNumber: currentPage,
    size: 10
  })

  const handleSetBio = () => setState(s => ({ ...s, setBio: !setBio }))

  const removeCurrentBio = () =>
    setState(state => ({
      ...state,
      currentBio: { _id: '', meaning: '', name: '', price: 0, src: '' }
    }))

  const selectHandler = (bio: Bio_) => () => setState(state => ({ ...state, currentBio: bio }))

  const { mutate: unlockBio, isLoading: isSelecting } = useSelectBio({
    onError: () => {
      showToast('Something went wrong will unlocking bio')
    },
    onSuccess: () => {
      removeCurrentBio()
      showToast('Bio is unlocked')
    }
  })

  const { mutate: unlockAndSelect, isLoading: isUnlockingAndSelecting } = useUnlockAndSelect({
    onError: () => {
      showToast('Something went wrong will unlocking bio')
    },
    onSuccess: () => {
      removeCurrentBio()
      showToast('Bio is unlocked and selected')
    }
  })

  const unlockHandler = (id: string) => () => {
    if (setBio) unlockAndSelect(id)
    else unlockBio(id)
  }

  const lastCardRef = useFetchNextPage({
    fetchNextPage: () => {
      setState(s => ({ ...s, currentPage: currentPage + 1 }))
    },
    hasNextPage: hasMore,
    isLoading: loading
  })

  return (
    <>
      <div className={css.bio_wrapper}>
        {bios.map(({ _id, name, src, meaning, price }, index) => (
          <div key={_id} className={css.card_wrapper}>
            <Card className={css.card}>
              <Image src={src} alt={name} height="240px" width="100%" />
              <CardContent className={css.card_content}>
                <Typography gutterBottom variant="h5" component="div" className={css.title}>
                  {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {meaning}
                </Typography>
              </CardContent>
              <div className={css.footer}>
                <Button
                  label="unlock"
                  onClick={selectHandler({ _id, name, src, meaning, price })}
                  className={css.buy}
                />
                <div className={css.price}>
                  <CoinsIcon2 />
                  <code>{numberFormat(price)}</code>
                </div>
              </div>
            </Card>
            {index === 6 && <span ref={lastCardRef} />}
          </div>
        ))}
      </div>
      {loading && (
        <div className={css.next_page_loader}>
          <DotLoader />
        </div>
      )}
      <Popup open={!!currentBio._id} onClose={removeCurrentBio}>
        <div className={css.confirm}>
          <div className={css.popup_wrapper}>
            <Typography variant="h4">Want to unlock this bio?</Typography>
            <div style={{ height: 8 }} />
            <Typography variant="body1">Coins will be deducted for unlocking bio</Typography>
            <div style={{ height: 8 }} />
            <Checkbox checked={setBio} label="Set as a bio" onChange={handleSetBio} />
            <div className={css.popup_btn}>
              <Button label="cancel" variant="contained" onClick={removeCurrentBio} className={css.cancel_btn} />
              <Button
                label="unlock"
                loading={isSelecting || isUnlockingAndSelecting}
                onClick={unlockHandler(currentBio._id)}
              />
            </div>
          </div>
        </div>
      </Popup>
    </>
  )
}

BioPage.Layout = HomeLayout

export default BioPage
