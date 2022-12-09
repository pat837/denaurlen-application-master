import { ButtonBase } from '@mui/material'
import router from 'next/router'
import { useContext } from 'react'
import { useDispatch } from 'react-redux'

import { ProfileContext } from '../../../contexts/profile.context'
import { profilePageActions } from '../../../data/actions'
import useCopyToClipboard from '../../../hooks/copy-to-clipboard.hook'
import usePopup from '../../../hooks/popup.hook'
import useShareOption from '../../../hooks/share.hook'
import EditIcon from '../../icons/edit2.icon'
import LinkIcon from '../../icons/link.icon'
import ShareIcon from '../../icons/share.icon'
import Popup from '../../ui/popup'
import css from './profile-options.module.scss'

const ProfileOptions = () => {
  const { profile: user } = useContext(ProfileContext)
  const dispatch = useDispatch()
  const { closePopup, isOpen } = usePopup()
  const copyToClipboard = useCopyToClipboard()
  const shareOption = useShareOption()

  const handleCopy = () => {
    copyToClipboard({
      copyText: `${window.location.origin}/${user.username}`,
      message: 'Copied link to clipboard'
    })
    closePopup()
  }
  const handleShare = () => {
    shareOption({
      url: `${window.location.origin}/${user.username}`
    })
    closePopup()
  }
  const handleUpdateBios = () => router.replace('/bios')
  const handleCategories = () => router.replace('/profile/categories')
  const openEditProfile = () => {
    dispatch(
      profilePageActions.openEditProfile({
        country: user.country,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        gender: user.gender,
        location: {
          type: 'Point',
          coordinates: user.location.coordinates
        },
        name: user.name,
        username: user.username,
        place: user.place,
        profilePic: user.profilePic,
        countryCode: user.countryCode
      })
    )
    closePopup()
  }

  return (
    <Popup open={isOpen('profile-options')} onClose={closePopup}>
      <div className={css.popup}>
        <div className={css.wrapper}>
          <ButtonBase onClick={handleShare}>
            <ShareIcon />
            <span>Share</span>
          </ButtonBase>
          <ButtonBase onClick={handleCopy}>
            <LinkIcon />
            <span>Link</span>
          </ButtonBase>
          <ButtonBase onClick={openEditProfile}>
            <EditIcon />
            <span>Edit</span>
          </ButtonBase>
          <ButtonBase onClick={handleUpdateBios}>
            <span>Update Bio</span>
          </ButtonBase>
          <ButtonBase onClick={handleCategories}>
            <span>Top10 Categories</span>
          </ButtonBase>
        </div>
      </div>
    </Popup>
  )
}

export default ProfileOptions
