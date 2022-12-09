import { ButtonBase, Drawer, IconButton, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Point } from 'react-easy-crop/types'
import { useSelector } from 'react-redux'

import useAddValuationPost from '../../api-routes/posts/valuation/add-valuation-post'
import ArrowLeftIcon from '../../components/icons/arrow-left.icon'
import PlusIcon from '../../components/icons/plus.icon'
import ZoomInIcon from '../../components/icons/zoom-in.icon'
import ZoomOutIcon from '../../components/icons/zoom-out.icon'
import Button from '../../components/ui/button'
import Picture from '../../components/ui/picture'
import RadioButton from '../../components/ui/radio-button'
import constants from '../../config/constants'
import { getCroppedImg } from '../../utils/image.utils'
import { ProfileContext } from '../../contexts/profile.context'
import useSearch from '../../hooks/search.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import formCSS from '../../styles/pages/uploads.module.scss'
import css from '../../styles/pages/uploads/category-post.module.scss'
import { storeType } from '../../types'

const replaceLast = (str: string, pattern: string | RegExp, replacement: string) => {
  const match =
    typeof pattern === 'string'
      ? pattern
      : (str.match(new RegExp(pattern.source, 'g')) || []).slice(-1)[0]
  if (!match) return str
  const last = str.lastIndexOf(match)
  return last !== -1 ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}` : str
}

const ValuationPostUpload = () => {
  const router = useRouter()
  const { currentPage } = useSelector((s: storeType) => s.addPostPopup)

  useEffect(() => {
    history.pushState(null, '', window.location.href)

    const eventHandler = () => {
      history.go(1)
      router.replace(currentPage)
    }

    window.addEventListener('popstate', eventHandler)

    return () => window.removeEventListener('popstate', eventHandler)
  }, [currentPage, router])

  return (
    <div className={css.page}>
      <AddPostFrom />
    </div>
  )
}

const AddPostFrom = () => {
  const {
    profile: { username }
  } = useContext(ProfileContext)
  const { currentPage } = useSelector((s: storeType) => s.addPostPopup)
  const photoInputRef = useRef<null | HTMLInputElement>(null)
  const [person, setPerson] = useState('')
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState<any>(null)
  const [showEdit, setShowEdit] = useState(false)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [croppedImage, setCroppedImage] = useState<any>(null)
  const [premiumStoryValue, setPremiumStoryValue] = useState(100)
  const router = useRouter()
  const showToast = useToastMessage()

  const { users: persons } = useSearch(person.slice(1).trim(), 1, 10, 3)

  const zoomHandler = (type: 'DEC' | 'INC') => () => {
    if (type === 'DEC' && zoom > 1) setZoom(zoom - 0.1)
    else if (type === 'INC' && zoom < 3) setZoom(zoom + 0.1)
  }

  const suggestionHandler = (username: string) => () => {
    setCaption(replaceLast(caption, person.slice(1), username))
    setPerson('')
  }

  const handleCaptionChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newCaption = event.target.value

    setCaption(newCaption)

    const usersList = newCaption.match(constants.USERNAME_DETECT_REGEX) || []

    if (usersList.length > 0) {
      const username = usersList[usersList.length - 1]

      const splitArray = newCaption.split(username)

      setPerson(splitArray[splitArray.length - 1].length === 0 ? username : '')
    }
  }

  const onStroyCoinsChange = (e: any) => setPremiumStoryValue(e.target.value)

  const { mutate: uploadValuationPost, isLoading: isSubmitting } = useAddValuationPost({
    username: username,
    onSuccess: () => {
      router.replace('/profile')
      showToast('Post uploaded')
    },
    onError: ({ response }: any) => {
      showToast(response?.data?.message || 'Unable to upload post, please try later')
    }
  })

  const closeCropper = () => setShowEdit(false)

  const backHandler = () => router.replace(currentPage)

  const showCroppedImage = useCallback(
    async (croppedPixels: any) => {
      try {
        croppedPixels = !!croppedPixels ? croppedPixels : croppedAreaPixels
        const croppedImage: any = await getCroppedImg(image, croppedPixels, 0)
        setBlob(await fetch(croppedImage).then(res => res.blob()))
        setCroppedImage(croppedImage)
      } catch (e) {}
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

  const photoInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (!!e.target.files && !!e.target.files[0]) {
      if (e.target.files[0].size / 1024 ** 2 <= 10) {
        setImage(URL.createObjectURL(e.target.files[0]))
        setShowEdit(true)
      } else {
        showToast('Picture should be less than 10MB')
        e.target.value = ''
      }
    }
  }

  const fileInputHandler = () => {
    if (photoInputRef.current) {
      photoInputRef.current.value = ''
      photoInputRef.current.click()
    }
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (blob === null) return null

    uploadValuationPost({
      aspectRatio: constants.POST_ASPECT_RATIO,
      baseValue: 1000,
      image: blob,
      viewValue: premiumStoryValue,
      caption: caption
      // place:
    })
  }

  return (
    <div className={formCSS.video_uploader_wrapper}>
      <form
        className={`${formCSS.upload_from} ${formCSS.video_from}`}
        onSubmit={submitHandler}
        autoComplete="off"
      >
        <div className={formCSS.title_section}>
          <IconButton aria-label="back" edge="start" onClick={backHandler}>
            <ArrowLeftIcon />
          </IconButton>
          <h3>New Post</h3>
          <div style={{ width: 40 }} />
        </div>
        <span />
        {croppedImage === null ? (
          <ButtonBase className={formCSS.add_video_btn} onClick={fileInputHandler}>
            <PlusIcon />
            <span className={formCSS.message}>Upload a post</span>
          </ButtonBase>
        ) : (
          <div className={css.preview_image}>
            <Picture
              alt="preview"
              src={croppedImage}
              aspectRatio={`${constants.POST_ASPECT_RATIO}`}
              isSrcAbsolute
            />
            <div className={css.edit_button_wrapper}>
              <ButtonBase className={css.edit_button} onClick={fileInputHandler}>
                Change Pic
              </ButtonBase>
            </div>
          </div>
        )}
        <div className={formCSS.suggestion_container}>
          <div className={formCSS.suggestion_wrapper}>
            {persons.map(p => (
              <ButtonBase
                key={p._id}
                className={formCSS.suggestion}
                onClick={suggestionHandler(p.username)}
              >
                @{p.username}
              </ButtonBase>
            ))}
          </div>
        </div>
        <TextField
          multiline
          rows={4}
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Write a Caption"
        />
        <div className={css.form_control}>
          <p>Value to view post</p>
          <div className={css.radio_group}>
            <RadioButton
              label="100"
              checked={100 == premiumStoryValue}
              name="story-value"
              value={100}
              onChange={onStroyCoinsChange}
            />
            <RadioButton
              label="150"
              checked={150 == premiumStoryValue}
              name="story-value"
              value={150}
              onChange={onStroyCoinsChange}
            />
            <RadioButton
              label="200"
              checked={200 == premiumStoryValue}
              name="story-value"
              value={200}
              onChange={onStroyCoinsChange}
            />
            <RadioButton
              label="500"
              checked={500 == premiumStoryValue}
              name="story-value"
              value={500}
              onChange={onStroyCoinsChange}
            />
          </div>
        </div>
        <div className={css.form_control}>
          <p>Base Value</p>
          <TextField placeholder="Base Value" value={1000} />
          <p>1000 u-coins will be redeemed from your u-coin wallet</p>
        </div>
        <input
          hidden
          type="file"
          name="post"
          accept="image/*"
          ref={photoInputRef}
          onChange={photoInputHandler}
        />
        <div className={formCSS['btn-wrapper']}>
          <Button label="cancel" variant="text" onClick={() => router.replace('/profile')} />
          <Button label="Post" type="submit" loading={isSubmitting} />
        </div>
      </form>
      <Drawer open={showEdit} anchor="bottom">
        <div className={formCSS.crop_drawer}>
          <div className={formCSS.edit_button_wrapper}>
            <ButtonBase className={formCSS.btn_edit} onClick={closeCropper}>
              Cancel
            </ButtonBase>
            <ButtonBase className={formCSS.btn_edit} onClick={closeCropper}>
              Done
            </ButtonBase>
          </div>
          <div className={formCSS['crop-wrapper']}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={0}
              aspect={constants.POST_ASPECT_RATIO}
              objectFit="contain"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className={formCSS.edit_controls_wrapper}>
            <div>
              <div className={formCSS.edit_row1_wrapper}>
                <div className={formCSS.edit_row1}>
                  <IconButton
                    aria-label="zoom-out"
                    className={`${zoom <= 1 && formCSS.disabled}`}
                    onClick={zoomHandler('DEC')}
                  >
                    <ZoomOutIcon />
                  </IconButton>
                  <IconButton
                    aria-label="zoom-in"
                    className={`${zoom >= 3 && formCSS.disabled}`}
                    onClick={zoomHandler('INC')}
                  >
                    <ZoomInIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default ValuationPostUpload
