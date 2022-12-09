import { Avatar, ButtonBase, Drawer, IconButton, useMediaQuery } from '@mui/material';
import { ChangeEvent, FormEvent, ReactNode, useCallback, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Point } from 'react-easy-crop/types';
import { useDispatch, useSelector } from 'react-redux';

import profileService from '../../api-routes/Profile'
import { getCroppedImg } from '../../utils/image.utils'
import { getMediaURL } from '../../utils/get-url'
import { profilePageActions } from '../../data/actions'
import css from '../../styles/profile-card.module.scss'
import { storeType } from '../../types'
import ImageIcon from '../icons/ImageIcon'
import TrashIcon from '../icons/trash.icon'
import XIcon from '../icons/x.icon'
import Button from '../ui/button'
import DialogBox from '../ui/image-dialog'

type ChangeProfilePicProps = {
  refetch: (...args: any) => any
}

const ChangeProfilePic = ({ refetch }: ChangeProfilePicProps) => {
  const isSmallDevice = useMediaQuery('(max-width: 630px)')

  const {
    isEditProfilePicOpen: isOpen,
    editProfile: { profilePic }
  } = useSelector((store: storeType) => store.profilePage)
  const dispatch = useDispatch()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [image, setImage] = useState<any>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [croppedImage, setCroppedImage] = useState<any>(null)

  const inputRef = useRef<null | HTMLInputElement>(null)

  const onClose = () => {
    refetch()
    dispatch(profilePageActions.closeEditProfilePic())
  }
  const selectPic = () => {
    inputRef.current?.click()
  }

  const showCroppedImage = useCallback(
    async (croppedPixels: any) => {
      try {
        croppedPixels = !!croppedPixels ? croppedPixels : croppedAreaPixels
        const croppedImage: any = await getCroppedImg(image, croppedPixels, 0)
        setBlob(await fetch(croppedImage).then(res => res.blob()))
        setCroppedImage(croppedImage)
      } catch (e) {
        // error
      }
    },
    [croppedAreaPixels, image]
  )

  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels)
      showCroppedImage(croppedAreaPixels)
    },
    [showCroppedImage]
  )

  const fileInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!!e.target.files && !!e.target.files[0]) setImage(URL.createObjectURL(e.target.files[0]))
  }

  const handleChangeDP = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (blob === null) return

    setIsSubmitting(true)

    profileService
      .changeDP(blob)
      .then(() => {
        refetch()
        setIsSubmitting(false)
        onClose()
      })
      .catch(() => null)
  }

  const removeProfilePic = () => {
    setIsSubmitting(true)
    profileService
      .removeDP()
      .then(() => {
        refetch()
        setIsSubmitting(false)
        onClose()
      })
      .catch(() => setIsSubmitting(false))
  }

  const title = (
    <div className={css['edit-profile-title-section']}>
      <h3>Edit Profile</h3>
      <form autoComplete="off" id="edit-profile-pic-form" onSubmit={handleChangeDP}>
        <Button label="save" loading={isSubmitting} type="submit" />
        {!profilePic || (
          <IconButton aria-label="delete pic" className={css['delete-dp-icon']} onClick={removeProfilePic}>
            <TrashIcon />
          </IconButton>
        )}
        <IconButton aria-label="cancel" edge="end" className={css.cancel} onClick={onClose}>
          <XIcon />
        </IconButton>
      </form>
    </div>
  )

  const drawerTitle = (
    <div className={css['edit-profile-title-section1']}>
      <form
        autoComplete="off"
        id="edit-profile-pic-form1"
        className={css['edit-profile-pic-form1']}
        onSubmit={handleChangeDP}
      >
        <div>
          <Button label="cancel" variant="text" onClick={onClose} />
          {!profilePic || (
            <IconButton
              aria-label="delete pic"
              className={css['delete-dp-icon']}
              onClick={removeProfilePic}
            >
              <TrashIcon />
            </IconButton>
          )}
        </div>
        <Button label="save" loading={isSubmitting} type="submit" />
      </form>
    </div>
  )

  return (
    <Wrapper
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      isSmallDevice={isSmallDevice}
      drawerTitle={drawerTitle}
    >
      <div className={css['change-profile-pic-wrapper']}>
        <div className={css['image-wrapper']}>
          <Avatar
            imgProps={{ loading: 'lazy' }}
            className={css['dp']}
            src={croppedImage || getMediaURL(profilePic)}
            // variant="square"
          />
        </div>
        <div className={`${css['edit-wrapper']} ${css['no-image']}`}>
          <input type="file" name="name" accept="image/*" ref={inputRef} hidden onChange={fileInputHandler} />
          {!!image ? (
            <>
              <div className={css['crop-wrapper']}>
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1 / 1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className={css['btn-wrapper']}>
                <Button label="choose another" variant="text" onClick={selectPic} />
              </div>
            </>
          ) : (
            <ButtonBase className={css['add-file-button']} onClick={selectPic}>
              <ImageIcon />
              <p>Click here to select a picture</p>
            </ButtonBase>
          )}
        </div>
      </div>
    </Wrapper>
  )
}

export default ChangeProfilePic

const Wrapper = ({
  children,
  isOpen,
  onClose,
  title,
  isSmallDevice,
  drawerTitle
}: {
  children: ReactNode
  isOpen: boolean
  onClose: () => any
  title: ReactNode
  isSmallDevice: boolean
  drawerTitle: ReactNode
}) =>
  isSmallDevice ? (
    <Drawer
      variant="temporary"
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: css['change-profile-pic-drawer'] }}
    >
      <div className={css['change-profile-pic-dialog']}>{children}</div>
      {drawerTitle}
    </Drawer>
  ) : (
    <DialogBox
      isOpen={isOpen}
      onClose={onClose}
      titleSection={title}
      className={css['change-profile-pic-dialog']}
    >
      {children}
    </DialogBox>
  )
