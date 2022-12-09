import { Autocomplete, ButtonBase, Drawer, IconButton, LinearProgress, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { Point } from 'react-easy-crop/types'
import { useSelector } from 'react-redux'

import useAddGeneralPost from '../../api-routes/posts/general/add-post'
import ArrowLeftIcon from '../../components/icons/arrow-left.icon'
import CropIcon from '../../components/icons/crop.icon'
import DeleteIcon from '../../components/icons/delete.icon'
import EditIcon2 from '../../components/icons/edit2.icon'
import ImageIcon from '../../components/icons/image.icon'
import PlusIcon from '../../components/icons/plus.icon'
import VideoIcon from '../../components/icons/video.icon'
import ZoomInIcon from '../../components/icons/zoom-in.icon'
import ZoomOutIcon from '../../components/icons/zoom-out.icon'
import AvatarRing from '../../components/ui/avatar-ring'
import Button from '../../components/ui/button'
import ImageTag from '../../components/ui/picture'
import Popup from '../../components/ui/popup'
import constants from '../../config/constants'
import { getCroppedImg } from '../../utils/image.utils'
import { ProfileContext } from '../../contexts/profile.context'
import useSearch from '../../hooks/search.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import css from '../../styles/pages/uploads.module.scss'
import { storeType } from '../../types'

type PostType_ = 'IMAGE' | 'VIDEO'
type State_ = {
  postType: PostType_
  openPopup: boolean
}

const replaceLast = (str: string, pattern: string | RegExp, replacement: string) => {
  const match =
    typeof pattern === 'string'
      ? pattern
      : (str.match(new RegExp(pattern.source, 'g')) || []).slice(-1)[0]
  if (!match) return str
  const last = str.lastIndexOf(match)
  return last !== -1 ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}` : str
}

const GeneralPostUpload = () => {
  const [photoInputRef, videoInputRef, placeRef, captionRef] = [
    useRef<null | HTMLInputElement>(null),
    useRef<null | HTMLInputElement>(null),
    useRef<null | HTMLInputElement>(null),
    useRef<null | HTMLInputElement>(null)
  ]

  const [{ postType, openPopup }, setState] = useState<State_>({
    postType: 'IMAGE',
    openPopup: true
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const showToast = useToastMessage()
  const { currentPage } = useSelector((s: storeType) => s.addPostPopup)
  const router = useRouter()
  const { profile } = useContext(ProfileContext)
  const [place, setPlace] = useState('')
  const [location, setLocation] = useState('')
  const [coordinates, setCoordinates] = useState<number[]>([])
  const [user, setUser] = useState('')
  const [taggedUsers, setTaggedUsers] = useState<any[]>([])
  const [caption, setCaption] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [showCrop, setShowCrop] = useState(false)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [postAspectRatio, setPostAspectRatio] = useState(999)
  const [previewPost, setPreviewPost] = useState(0)
  const [posts, setPosts] = useState<string[]>([])
  const [postBlobList, setPostList] = useState<File[]>([])
  const [person, setPerson] = useState('')
  const [videoInputMessage, setVideoInputMessage] = useState('Add a post')
  const [isVideoAdded, setIsVideoAdded] = useState(false)

  useEffect(() => {
    history.pushState(null, '', window.location.href)

    const eventHandler = () => {
      history.go(1)
      router.replace(currentPage)
    }

    window.addEventListener('popstate', eventHandler)

    return () => window.removeEventListener('popstate', eventHandler)
  }, [currentPage, router])

  const showCroppedImage = useCallback(
    async (croppedPixels: any) => {
      try {
        croppedPixels = !!croppedPixels ? croppedPixels : croppedAreaPixels
        const croppedImage: any = await getCroppedImg(posts[previewPost], croppedPixels, 0)
        setBlob(await fetch(croppedImage).then(res => res.blob()))
      } catch (e) {}
    },
    [croppedAreaPixels, posts, previewPost]
  )

  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels)
      showCroppedImage(croppedAreaPixels)
    },
    [showCroppedImage]
  )

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

  useEffect(() => {
    if (typeof google !== 'undefined') {
      const initializer = () => {
        if (!!placeRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(placeRef?.current, {
            types: ['geocode']
          })

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            const [latitude, longitude] = [
              place.geometry?.location?.lat(),
              place.geometry?.location?.lng()
            ]

            if (!latitude || !longitude || !place.formatted_address) return null

            setPlace(place.formatted_address)
            setCoordinates([longitude, latitude])
          })
        }
      }
      initializer()
    }
  }, [location, placeRef])

  const { users, loading } = useSearch(user.trim(), 1, 100, 2)
  const { users: persons } = useSearch(person.slice(1).trim(), 1, 10, 3)

  const suggestionHandler = (username: string) => () => {
    setCaption(replaceLast(caption, person.slice(1), username))
    setPerson('')
    captionRef.current?.focus()
  }

  const nextHandler = () => {
    if (postBlobList.length > 0 && posts.length > 0) {
      setOpenForm(true)

      posts.forEach(url => {
        let img = new Image()
        img.src = url

        img.onload = () => {
          const aspectRatio = img.width / img.height
          if (aspectRatio < postAspectRatio) setPostAspectRatio(aspectRatio)
        }
      })
    }
  }

  const openCropper = () => setShowCrop(true)
  const closeCropper = () => {
    setZoom(1)
    setCrop({ x: 0, y: 0 })
    setBlob(null)
    setZoom(1)
    setCroppedAreaPixels(null)
    setPostAspectRatio(1)
    setShowCrop(false)
  }

  const editHandler = () => {
    if (blob !== null) {
      const url = URL.createObjectURL(blob)
      setPosts(posts.map((post, index) => (index === previewPost ? url : post)))
      setPostList(
        postBlobList.map((post, index) =>
          index === previewPost
            ? new File([blob], `image-${index}.${blob.type.split('/')[1]}`, {
                type: blob.type
              })
            : post
        )
      )
    }
    closeCropper()
  }

  const postTypeHandler = (type: PostType_) => () => {
    const input = type === 'VIDEO' ? videoInputRef : photoInputRef
    if (input.current) {
      input.current.value = ''
      input.current.click()
    }
    setState({ postType: type, openPopup: false })
  }

  const zoomHandler = (type: 'DEC' | 'INC') => () => {
    if (type === 'DEC' && zoom > 1) setZoom(zoom - 0.1)
    else if (type === 'INC' && zoom < 3) setZoom(zoom + 0.1)
  }

  const removeHandler = () => {
    const postList = [...posts.slice(0, previewPost), ...posts.slice(previewPost + 1)]
    const blobList = [...postBlobList.slice(0, previewPost), ...postBlobList.slice(previewPost + 1)]

    if (postList.length <= previewPost) setPreviewPost(previewPost - 1)

    setPostList(blobList)
    setPosts(postList)
  }

  const closeHandler = () => {
    closeCropper()
    router.replace('/profile')
  }

  const photoInputHandler = () => {
    if (photoInputRef.current?.files) {
      let arr: string[] = posts
      let list = postBlobList
      const photos = photoInputRef.current.files

      for (let index = 0; index < photos.length && arr.length < 10; index++) {
        const img = photos[index]

        if (img.size / 1024 ** 2 <= 10) {
          arr = [...arr, URL.createObjectURL(img)]
          list = [...list, img]
        } else showToast('Picture should be less than 10MB')
      }

      setPosts(arr)
      setPostList(list)
    }
  }

  const videoInputHandler = () => {
    if (videoInputRef.current?.files) {
      if (videoInputRef.current.files[0].size / 1024 ** 2 <= 50) {
        setPostList([videoInputRef.current.files[0]])
        setVideoInputMessage(videoInputRef.current.files[0].name)
        setIsVideoAdded(true)
      } else {
        showToast('Video should be less than 50MB')
        videoInputRef.current.value = ''
        setIsVideoAdded(false)
      }
    }
  }

  const { mutate: addGeneralPost, isLoading: isSubmitting } = useAddGeneralPost({
    onSuccess: () => {
      closeHandler()
      showToast('Added a post')
    },
    onError: () => {
      showToast('Unable to add post, try again later')
    },
    username: profile.username
  })

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (postBlobList.length === 0) return null

    addGeneralPost({
      images: postBlobList,
      place,
      location: coordinates,
      caption,
      ratio: postAspectRatio,
      tags: Array.from(new Set(taggedUsers.map(person => person._id) || [])),
      hashTags: Array.from(new Set(caption.match(constants.HASHTAG_DETECT_REGEX) || [])),
      isVideo: postType === 'VIDEO',
      setProgress: (n: number) => {
        setUploadProgress(n)
      }
    })
  }

  return (
    <>
      {postType === 'IMAGE' ? (
        <div className={css.page_wrapper}>
          <div className={css.wrapper}>
            <div
              className={css.image_preview}
              style={{ backgroundImage: `url('${posts[previewPost]}')` }}
            >
              <div className={css.option_wrapper}>
                <ButtonBase
                  className={css.option_btn}
                  onClick={() => setState(state => ({ ...state, openPopup: true }))}
                >
                  <ArrowLeftIcon />
                  <span>Back</span>
                </ButtonBase>
                <IconButton aria-label="delete" onClick={removeHandler} className={css.delete_btn}>
                  <DeleteIcon />
                </IconButton>
              </div>
              <div className={`${css.options} ${css.crop}`}>
                <ButtonBase className={css.option_btn} onClick={openCropper}>
                  <EditIcon2 />
                  <span>Edit</span>
                </ButtonBase>
              </div>
              <div className={`${css.options} ${css.next}`}>
                <ButtonBase className={css.option_btn} onClick={nextHandler}>
                  <span>Next</span>
                </ButtonBase>
              </div>
            </div>
            {postType === 'IMAGE' ? (
              <div className={css.image_preview_slider}>
                <div className={css.image_preview_wrapper}>
                  {posts.length > 0 &&
                    posts.map((post, index) => (
                      <div
                        key={index}
                        role="button"
                        className={`${css.preview_img} ${index === previewPost && css.current}`}
                        onClick={() => setPreviewPost(index)}
                      >
                        <ImageTag src={post} isSrcAbsolute alt="post" />
                      </div>
                    ))}
                  {posts.length < 10 && (
                    <ButtonBase className={css.add_more} onClick={postTypeHandler('IMAGE')}>
                      <PlusIcon />
                    </ButtonBase>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <Drawer open={showCrop} anchor="bottom">
            <div className={css.crop_drawer}>
              <div className={css.edit_button_wrapper}>
                <ButtonBase className={css.btn_edit} onClick={closeCropper}>
                  Cancel
                </ButtonBase>
                <ButtonBase className={css.btn_edit} onClick={editHandler}>
                  Done
                </ButtonBase>
              </div>
              <div className={css['crop-wrapper']}>
                <Cropper
                  image={posts[previewPost]}
                  crop={crop}
                  zoom={zoom}
                  rotation={0}
                  aspect={1}
                  objectFit="contain"
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className={css.edit_controls_wrapper}>
                <div>
                  <div className={css.edit_row1_wrapper}>
                    <div className={css.edit_row1}>
                      <IconButton
                        aria-label="zoom-out"
                        className={`${zoom <= 1 && css.disabled}`}
                        onClick={zoomHandler('DEC')}
                      >
                        <ZoomOutIcon />
                      </IconButton>
                      <IconButton
                        aria-label="zoom-in"
                        className={`${zoom >= 3 && css.disabled}`}
                        onClick={zoomHandler('INC')}
                      >
                        <ZoomInIcon />
                      </IconButton>
                    </div>
                  </div>
                  <div>
                    <div>
                      <CropIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Drawer>
          <Drawer anchor="bottom" open={openForm}>
            <div className={css.upload_from_wrapper}>
              <form className={css.upload_from} onSubmit={submitHandler} autoComplete="off">
                <div className={css.title_section}>
                  <IconButton aria-label="back" edge="start" onClick={() => setOpenForm(false)}>
                    <ArrowLeftIcon />
                  </IconButton>
                  <h3>New Post ({postBlobList.length}/10)</h3>
                  <div style={{ width: 40 }} />
                </div>
                <span />
                {postType === 'IMAGE' ? (
                  <div className={css.image_preview_slider_f1}>
                    <div className={css.image_preview_slider_f}>
                      <div className={css.image_preview_wrapper_f}>
                        {posts.length > 0 &&
                          posts.map((post, index) => (
                            <div key={index} style={{ cursor: 'default' }} className={css.preview_img}>
                              <ImageTag src={post} isSrcAbsolute alt="post" />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className={css.suggestion_container}>
                  <div className={css.suggestion_wrapper}>
                    {persons.map(p => (
                      <ButtonBase
                        key={p._id}
                        className={css.suggestion}
                        onClick={suggestionHandler(p.username)}
                      >
                        <AvatarRing username={p.username} url={p.profilePic} size={32} />
                        {p.username}
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
                  inputRef={captionRef}
                />
                <TextField
                  inputRef={placeRef}
                  placeholder="Enter a Location (Place)"
                  onChange={e => setLocation(e.target.value)}
                />
                <Autocomplete
                  multiple
                  limitTags={2}
                  id="multiple-limit-tags"
                  options={users}
                  getOptionLabel={option => option.username}
                  onInputChange={(event, newInputValue) => {
                    setUser(newInputValue)
                  }}
                  value={taggedUsers}
                  onChange={(event: any, newValue: any[]) => {
                    setTaggedUsers(newValue)
                  }}
                  loading={loading}
                  renderInput={params => <TextField {...params} placeholder="Tag a person" />}
                />
                <div className={css['btn-wrapper']}>
                  <Button label="Cancel" variant="text" onClick={closeHandler} />
                  <Button label="Post" type="submit" loading={isSubmitting} />
                </div>
              </form>
            </div>
          </Drawer>
        </div>
      ) : (
        <div className={css.video_uploader_wrapper}>
          <form
            className={`${css.upload_from} ${css.video_from}`}
            onSubmit={submitHandler}
            autoComplete="off"
          >
            <div className={css.title_section}>
              <IconButton
                aria-label="back"
                edge="start"
                onClick={() => setState(state => ({ ...state, openPopup: true }))}
              >
                <ArrowLeftIcon />
              </IconButton>
              <h3>New Post</h3>
              <div style={{ width: 40 }} />
            </div>
            <span />
            <ButtonBase className={css.add_video_btn} onClick={postTypeHandler('VIDEO')}>
              {isVideoAdded ? <VideoIcon /> : <PlusIcon />}
              <span className={css.message}>{videoInputMessage}</span>
            </ButtonBase>
            <div className={css.suggestion_container}>
              <div className={css.suggestion_wrapper}>
                {persons.map(p => (
                  <ButtonBase
                    key={p._id}
                    className={css.suggestion}
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
            <TextField
              inputRef={placeRef}
              placeholder="Enter a Location (Place)"
              onChange={e => setLocation(e.target.value)}
            />
            <Autocomplete
              multiple
              limitTags={2}
              id="multiple-limit-tags"
              options={users}
              getOptionLabel={option => option.username}
              onInputChange={(event, newInputValue) => {
                setUser(newInputValue)
              }}
              value={taggedUsers}
              onChange={(event: any, newValue: any[]) => {
                setTaggedUsers(newValue)
              }}
              loading={loading}
              renderInput={params => <TextField {...params} placeholder="Tag a person" />}
            />
            <div className={css['btn-wrapper']}>
              <Button label="cancel" variant="text" onClick={closeHandler} />
              <Button label="Post" type="submit" loading={isSubmitting} />
            </div>
          </form>
        </div>
      )}
      <Popup onClose={() => null} open={isSubmitting}>
        <div className={css.progress_wrapper}>
          <div className={css.progress}>
            <h4>Uploading post ({uploadProgress}%)</h4>
            <LinearProgress variant="indeterminate" />
          </div>
        </div>
      </Popup>
      <Popup onClose={() => router.replace(currentPage)} open={openPopup}>
        <div className={css.popup}>
          <h5>Select post type</h5>
          <div className={css.button_wrapper}>
            <ButtonBase className={css.file_type_button} onClick={postTypeHandler('IMAGE')}>
              <ImageIcon />
              <span>Photo</span>
            </ButtonBase>
            <ButtonBase className={css.file_type_button} onClick={postTypeHandler('VIDEO')}>
              <VideoIcon />
              <span>Video</span>
            </ButtonBase>
          </div>
        </div>
      </Popup>
      <input
        hidden
        type="file"
        name="post"
        multiple
        accept="image/*"
        ref={photoInputRef}
        onChange={photoInputHandler}
      />
      <input
        hidden
        type="file"
        name="video-post"
        accept="video/*"
        ref={videoInputRef}
        onChange={videoInputHandler}
      />
    </>
  )
}

export default GeneralPostUpload
