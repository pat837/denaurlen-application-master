import { ButtonBase, Drawer, IconButton, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Point } from 'react-easy-crop/types'
import { useSelector } from 'react-redux'

import useAddGeneralStory from '../../api-routes/posts/story/add-story'
import ArrowLeftIcon from '../../components/icons/arrow-left.icon'
import CropIcon from '../../components/icons/crop.icon'
import PlusIcon from '../../components/icons/plus.icon'
import ZoomInIcon from '../../components/icons/zoom-in.icon'
import ZoomOutIcon from '../../components/icons/zoom-out.icon'
import Button from '../../components/ui/button'
import Picture from '../../components/ui/picture'
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
    typeof pattern === 'string' ? pattern : (str.match(new RegExp(pattern.source, 'g')) || []).slice(-1)[0]
  if (!match) return str
  const last = str.lastIndexOf(match)
  return last !== -1 ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}` : str
}

const StoryUpload = () => {
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
  const [aspectRatio, setAspectRatio] = useState(9 / 16)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [croppedImage, setCroppedImage] = useState<any>(null)
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

  const { mutate: uploadStory, isLoading: isSubmitting } = useAddGeneralStory({
    callback: {
      success: () => {
        router.replace('/home')
        showToast('Story uploaded')
      },
      error: () => {
        showToast('Unable to upload story, try again later')
      }
    },
    username
  })

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (blob === null) return
    uploadStory({ image: blob, caption })
  }

  return (
    <div className={formCSS.video_uploader_wrapper}>
      <form className={`${formCSS.upload_from} ${formCSS.video_from}`} onSubmit={submitHandler} autoComplete="off">
        <div className={formCSS.title_section}>
          <IconButton aria-label="back" edge="start" onClick={backHandler}>
            <ArrowLeftIcon />
          </IconButton>
          <h3>New Story</h3>
          <div style={{ width: 40 }} />
        </div>
        <span />
        {croppedImage === null ? (
          <ButtonBase className={formCSS.add_video_btn} onClick={fileInputHandler}>
            <PlusIcon />
            <span className={formCSS.message}>Upload a story</span>
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
              <ButtonBase key={p._id} className={formCSS.suggestion} onClick={suggestionHandler(p.username)}>
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
        <input hidden type="file" name="post" accept="image/*" ref={photoInputRef} onChange={photoInputHandler} />
        <div className={formCSS['btn-wrapper']}>
          <Button label="cancel" type="reset" variant="text" onClick={backHandler} />
          <Button label="post" type="submit" loading={isSubmitting} />
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
              aspect={aspectRatio}
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
              <div>
                <div className={formCSS.crop_menu}>
                  <CropIcon />
                  <Button variant="blur" label="Full Screen" onClick={() => setAspectRatio(9 / 16)} />
                  <Button variant="blur" label="Square" onClick={() => setAspectRatio(1)} />
                  <Button variant="blur" label="8 : 10" onClick={() => setAspectRatio(8.5 / 11)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default StoryUpload
