import { ButtonBase } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import Popup from '../../../../components/ui/popup'
import graphColorPalettes, { PaletteType } from '../../../../config/graph-color-palette'
import { coinWalletActions } from '../../../../data/actions'
import usePopup from '../../../../hooks/popup.hook'
import { storeType } from '../../../../types'
import css from './graph-palette-menu.module.scss'

const Palette = ({ palette, isSelected }: { palette: string[]; isSelected: boolean }) => (
  <div className={`${css.palette} ${isSelected && css.selected}`}>
    {palette.map((color, indx) => (
      <div key={`${color}-${indx}`} style={{ backgroundColor: color }} />
    ))}
  </div>
)

const GraphPaletteMenu = () => {
  const { paletteName } = useSelector((store: storeType) => store.coinWallet)
  const dispatch = useDispatch()
  const { isOpen, closePopup } = usePopup()

  const changePaletteHandler = (palette: PaletteType) => () => {
    dispatch(coinWalletActions.setPallet(palette))
    closePopup()
  }

  return (
    <Popup open={isOpen('graph-color-palette')} onClose={closePopup}>
      <div className={css.wrapper}>
        {Object.keys(graphColorPalettes).map(key => (
          <ButtonBase key={key} className={css.btn} onClick={changePaletteHandler(key as PaletteType)}>
            <Palette palette={graphColorPalettes[key as PaletteType].bg} isSelected={key === paletteName} />
          </ButtonBase>
        ))}
      </div>
    </Popup>
  )
}

export default GraphPaletteMenu
