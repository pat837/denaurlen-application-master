import { Bio_ } from '../types/profile.type'
import usePopup from './popup.hook'

export const BIO_POPUP_KEY = 'bio-popup-in-profile'

const useBioPopupHandler = (bio: Omit<Bio_, '_id'>) => {
  const { openPopup } = usePopup()

  return () => {
    openPopup('bio-preview')
    window.sessionStorage.setItem(BIO_POPUP_KEY, JSON.stringify(bio))
  }
}

export default useBioPopupHandler
