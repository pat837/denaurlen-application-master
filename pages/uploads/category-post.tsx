import { ButtonBase, Drawer, IconButton, Skeleton, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Point } from 'react-easy-crop/types'
import { useDispatch, useSelector } from 'react-redux'

import useAddCategoryPost from '../../api-routes/posts/category/add-category-post'
import useFetchPostByCategory from '../../api-routes/posts/category/fetch-by-category'
import ArrowLeftIcon from '../../components/icons/arrow-left.icon'
import EmptyStateCameraIcon from '../../components/icons/empty-state-camera.icon'
import PlusIcon from '../../components/icons/plus.icon'
import ZoomInIcon from '../../components/icons/zoom-in.icon'
import ZoomOutIcon from '../../components/icons/zoom-out.icon'
import Button from '../../components/ui/button'
import CategoryIcon from '../../components/ui/category-post/icon'
import Picture from '../../components/ui/picture'
import constants from '../../config/constants'
import { getCroppedImg } from '../../utils/image.utils'
import { addHttpToLink } from '../../utils'
import { ProfileContext } from '../../contexts/profile.context'
import { addPostActions } from '../../data/actions'
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

const CategoryPostUpload = () => {
  const { categories } = useContext(ProfileContext)

  const dispatch = useDispatch()
  const router = useRouter()
  const { currentPage } = useSelector((s: storeType) => s.addPostPopup)
  const { categoryId, categorySlot } = useSelector((store: storeType) => store.addPostPopup)

  useEffect(() => {
    history.pushState(null, '', location.href)

    const eventHandler = () => {
      history.go(1)
      router.replace(currentPage)
    }

    window.addEventListener('popstate', eventHandler)

    return () => window.removeEventListener('popstate', eventHandler)
  }, [currentPage, router])

  const backHandler = () => router.replace(currentPage)

  const onCategorySelect = (categoryId: string) => () => {
    dispatch(addPostActions.selectCategory(categoryId))
  }

  return (
    <div className={css.page}>
      {!categoryId ? (
        <div className={css.wrapper}>
          <div className={css.heading}>
            <IconButton onClick={backHandler}>
              <ArrowLeftIcon />
            </IconButton>
            <h3>Choose Category</h3>
            <div className={css.fix} />
          </div>
          <div className={css.slot_wrapper}>
            {categories.map(({ _id, category, priority }) => (
              <ButtonBase
                key={_id}
                className={css.category_card}
                onClick={onCategorySelect(category._id)}
              >
                <CategoryIcon categoryId={category._id} src={category.src} />
                <p>
                  {priority}. {category.name}
                </p>
              </ButtonBase>
            ))}
          </div>
        </div>
      ) : !categorySlot ? (
        <ChooseCategorySlot />
      ) : (
        <AddCategoryPostFrom />
      )}
    </div>
  )
}

const ChooseCategorySlot = () => {
  const [dispatch, { profile }, { categoryId }] = [
    useDispatch(),
    useContext(ProfileContext),
    useSelector((store: storeType) => store.addPostPopup)
  ]

  const { data, isLoading } = useFetchPostByCategory({
    username: profile.username,
    categoryId: categoryId || ''
  })

  const onCategorySlotSelect = (slotNo: number) => () => {
    dispatch(addPostActions.selectCategorySlot(slotNo))
  }

  const backHandler = () => dispatch(addPostActions.clearCategory())

  return (
    <div className={css.wrapper}>
      <div className={css.heading}>
        <IconButton onClick={backHandler}>
          <ArrowLeftIcon />
        </IconButton>
        <h3>Choose Position</h3>
        <div className={css.fix} />
      </div>
      <div className={css.slot_wrapper}>
        {isLoading || !data
          ? Array.from(Array(10).keys()).map(index => (
              <Skeleton
                variant="rectangular"
                animation="wave"
                key={`${index}-loader`}
                className={``}
                height="100%"
              />
            ))
          : Array.from(Array(10).keys()).map(index => {
              const slotNo = index + 1
              const post = Array.from(data).find(post => post.slot === slotNo)

              return post?.slot == slotNo ? (
                <ButtonBase key={index} className={css.post_preview}>
                  <div>
                    <Picture alt="post" src={post.src[0]} />
                    <span>{slotNo}</span>
                  </div>
                </ButtonBase>
              ) : (
                <ButtonBase
                  key={index}
                  className={css.post_preview}
                  onClick={onCategorySlotSelect(index + 1)}
                >
                  <div>
                    <EmptyStateCameraIcon />
                    <span>{index + 1}</span>
                  </div>
                </ButtonBase>
              )
            })}
      </div>
    </div>
  )
}

const AddCategoryPostFrom = () => {
  const {
    profile: { username },
    categories
  } = useContext(ProfileContext)
  const { categoryId, categorySlot } = useSelector((store: storeType) => store.addPostPopup)

  const photoInputRef = useRef<null | HTMLInputElement>(null)
  const titleRef = useRef<null | HTMLInputElement>(null)
  const urlRef = useRef<null | HTMLInputElement>(null)
  const [person, setPerson] = useState('')
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState<any>(null)
  const [showEdit, setShowEdit] = useState(false)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [croppedImage, setCroppedImage] = useState<any>(null)
  const router = useRouter()
  const dispatch = useDispatch()
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

  const backHandler = () => {
    dispatch(addPostActions.clearCategorySlot())
  }

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

  const { mutate: uploadPost, isLoading: isSubmitting } = useAddCategoryPost({
    username,
    callback: {
      success: () => {
        router.replace('/profile')
        dispatch(addPostActions.clearCategoryAndSlot())
        showToast('Post uploaded')
      },
      error: () => {
        showToast('Unable to upload post, please try later')
      }
    }
  })

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (blob === null) return null

    if (!titleRef.current?.value) {
      titleRef.current?.focus()
      titleRef.current?.select()
      showToast('Add post title')
      return null
    }
    if (!urlRef.current?.value) {
      urlRef.current?.focus()
      urlRef.current?.select()
      showToast('Add post related URL')
      return null
    }

    const linkList = urlRef.current.value.match(constants.URL_DETECT_REGEX) || []

    if (!linkList.length) return showToast('Invalid link, please enter valid link.')

    uploadPost({
      caption,
      categoryId: categoryId || '',
      hashTags: Array.from(new Set(caption.match(constants.HASHTAG_DETECT_REGEX) || [])),
      image: blob,
      ratio: constants.POST_ASPECT_RATIO,
      slot: categorySlot || 0,
      title: titleRef.current.value,
      url: addHttpToLink(linkList[0])
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
        <div className={css.category_icon_wrapper}>
          <CategoryIcon
            categoryId={categoryId}
            src={categories.find(({ category }) => category._id === categoryId)?.category.src || ''}
            className={css.icon}
          />
          <span className={css.name}>
            {categorySlot}.&nbsp;
            {categories.find(({ category }) => category._id === categoryId)?.category.name || ''}
          </span>
        </div>
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
        <TextField placeholder="Post title" inputRef={titleRef} />
        <TextField placeholder="Post related URL" inputRef={urlRef} />
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

export default CategoryPostUpload
