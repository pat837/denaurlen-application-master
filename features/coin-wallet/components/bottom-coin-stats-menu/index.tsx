import { IconButton, useScrollTrigger } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import SlidersIcon from '../../../../components/icons/sliders.icon'
import Button from '../../../../components/ui/button'
import { coinWalletActions } from '../../../../data/actions'
import usePopup from '../../../../hooks/popup.hook'
import css from './style.module.scss'

import type { storeType } from '../../../../types'

const BottomCoinStatsMenu = () => {
  const {
    navbar: { autoHide },
    coinWallet: { stats }
  } = useSelector((store: storeType) => store)
  const dispatch = useDispatch()
  const trigger = useScrollTrigger({ target: undefined })
  const { openPopup } = usePopup()

  const toggleStats = () =>
    dispatch(coinWalletActions.changeCoinStatsTab(stats === 'INCOMING' ? 'OUTGOING' : 'INCOMING'))

  return (
    <>
      <div className={`${css.wrapper} ${(autoHide && trigger) || css.float_bottom}`}>
        <div className={css.menubar}>
          <IconButton aria-label="color-palette" onClick={() => openPopup('graph-color-palette')}>
            <SlidersIcon />
          </IconButton>
          <span className={css.divider} />
          <Button
            label={stats === 'OUTGOING' ? 'incoming coin stats' : 'outgoing coin stats'}
            variant="text"
            onClick={toggleStats}
          />
        </div>
      </div>
      <div className={css.bottom_menu_fix} />
    </>
  )
}

export default BottomCoinStatsMenu
