import { BIO_POPUP_KEY } from '../../../hooks/open-bio-popup.hook'
import usePopup from '../../../hooks/popup.hook'
import { Bio_ } from '../../../types/profile.type'
import Picture from '../../ui/picture'
import Popup from '../../ui/popup'
import css from './bio-preview-popup.module.scss'

const BioPreviewPopup = () => {
  const { isOpen, closePopup } = usePopup()
  const bio = JSON.parse(window.sessionStorage.getItem(BIO_POPUP_KEY) ?? '{}') as Omit<Bio_, '_id'>

  if (!bio) return <></>

  return (
    <Popup open={isOpen('bio-preview')} onClose={closePopup}>
      <div className={css.wrapper}>
        <div className={css.image}>
          <Picture alt={bio.name} src={bio.src} aspectRatio={'16 / 9'} />
        </div>
        <h6>{bio.name}</h6>
        <p>{bio.meaning}</p>
      </div>
    </Popup>
  )
}

export default BioPreviewPopup
