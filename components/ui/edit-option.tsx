import { ButtonBase, TextField } from '@mui/material'
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useEditCategoryPost from '../../api-routes/posts/category/edit-category-post'
import useEditGeneralPost from '../../api-routes/posts/general/edit-post'
import valuationService from '../../api-routes/posts/valuation'
import constants from '../../config/constants'
import { addHttpToLink } from '../../utils'
import { ProfileContext } from '../../contexts/profile.context'
import { postActions, postPopupActions } from '../../data/actions'
import useSearch from '../../hooks/search.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import css from '../../styles/components/ui/edit-option.module.scss'
import suggestionCSS from '../../styles/pages/uploads.module.scss'
import { storeType } from '../../types'
import AvatarRing from './avatar-ring'
import Button from './button'
import Popup from './popup'

type EditParams_ = { postId: string; caption: string; title: string; url: string }
type ChangeEvent_ = ChangeEvent<HTMLTextAreaElement | HTMLInputElement>

const editAction = ({ postId, caption }: EditParams_) => valuationService.edit(postId, { caption })

const replaceLast = (str: string, pattern: string | RegExp, replacement: string) => {
  const match =
    typeof pattern === 'string'
      ? pattern
      : (str.match(new RegExp(pattern.source, 'g')) || []).slice(-1)[0]
  if (!match) return str
  const last = str.lastIndexOf(match)
  return last !== -1 ? `${str.slice(0, last)}${replacement}${str.slice(last + match.length)}` : str
}

const EditOptionPopup = () => {
  const [
    dispatch,
    { showEdit, caption, postType, moreOptionsWithEditFor, link, title, categoryId },
    { categoryPost, generalPost, valuationPost },
    { profile },
    showToast
  ] = [
    useDispatch(),
    useSelector((store: storeType) => store.postState),
    useSelector((store: storeType) => store.postPopupState),
    useContext(ProfileContext),
    useToastMessage()
  ]
  const [person, setPerson] = useState('')
  const { users: persons } = useSearch(person.slice(1).trim(), 1, 10, 3)

  const [{ newCaption, newLink, newTitle, isSubmitting }, setState] = useState({
    newCaption: caption,
    newTitle: title,
    newLink: link,
    isSubmitting: false
  })

  useEffect(
    () => setState(state => ({ ...state, newCaption: caption, newLink: link, newTitle: title })),
    [caption, link, title]
  )

  const mutatePopup = () => {
    if (postType === 'GENERAL')
      dispatch(postPopupActions.openGeneralPost({ ...generalPost, caption: newCaption }))
    else if (postType === 'CATEGORY')
      dispatch(
        postPopupActions.openCategoryPost({
          ...categoryPost,
          caption: newCaption,
          title: newTitle,
          url: newLink
        })
      )
    else dispatch(postPopupActions.openValuationPost({ ...valuationPost, caption: newCaption }))
  }

  const handleClose = () => {
    dispatch(postActions.hideMoreOptionsWithEdit())
    dispatch(postActions.hideEditOption())
    setPerson('')
  }

  const successCallback = () => {
    mutatePopup()
    setState(state => ({
      ...state,
      isSubmitting: false,
      newCaption: '',
      newLink: '',
      newTitle: ''
    }))
    handleClose()
  }

  const errorCallback = () => {
    setState(state => ({ ...state, isSubmitting: false }))
    showToast('Unable to update, please try again later')
  }

  const { mutate: editGeneralPost } = useEditGeneralPost({
    onSuccess: successCallback,
    onError: errorCallback,
    username: profile.username
  })

  const { mutate: editCategoryPost } = useEditCategoryPost({
    successCallback: successCallback,
    errorCallback: errorCallback,
    username: profile.username,
    categoryId
  })

  const handleEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (postType === 'CATEGORY' && !newTitle && !newLink) return null

    if (postType === 'GENERAL') {
      setState(state => ({ ...state, isSubmitting: true }))
      return editGeneralPost({
        postId: moreOptionsWithEditFor,
        caption: newCaption.trim(),
        hashTags: Array.from(new Set(newCaption.match(constants.HASHTAG_DETECT_REGEX) || []))
      })
    }

    if (postType === 'VALUATION') {
      setState(state => ({ ...state, isSubmitting: true }))
      return editAction({
        postId: moreOptionsWithEditFor,
        caption: newCaption,
        url: newLink,
        title: newTitle
      })
        .then(successCallback)
        .catch(errorCallback)
    }

    const linkList = newLink.match(constants.URL_DETECT_REGEX) || []

    if (!linkList.length) return showToast('Invalid link, please enter valid link.')

    setState(state => ({ ...state, isSubmitting: true }))

    return editCategoryPost({
      postId: moreOptionsWithEditFor,
      caption: newCaption,
      url: addHttpToLink(linkList[0]),
      title: newTitle
    })
  }

  const suggestionHandler = (username: string) => () => {
    setState(state => ({
      ...state,
      newCaption: replaceLast(newCaption, person.slice(1), username)
    }))
    setPerson('')
  }

  const captionChangeHandler = (event: ChangeEvent_) => {
    const newCaption = event.target.value

    setState(state => ({ ...state, newCaption }))

    const usersList = newCaption.match(constants.USERNAME_DETECT_REGEX) || []

    if (usersList.length > 0) {
      const username = usersList[usersList.length - 1]

      const splitArray = newCaption.split(username)

      setPerson(splitArray[splitArray.length - 1].length === 0 ? username : '')
    }
  }

  const titleChangeHandler = (event: ChangeEvent_) => {
    setState(state => ({ ...state, newTitle: event.target.value as string }))
  }

  const linkChangeHandler = (event: ChangeEvent_) => {
    setState(state => ({ ...state, newLink: event.target.value as string }))
  }

  const options = (
    <form autoComplete="off" onSubmit={handleEdit} className={css.wrapper}>
      <div className={suggestionCSS.suggestion_container}>
        <div style={{ justifyContent: 'flex-start' }} className={suggestionCSS.suggestion_wrapper}>
          {persons.map(p => (
            <ButtonBase
              key={p._id}
              className={suggestionCSS.suggestion}
              onClick={suggestionHandler(p.username)}
            >
              <AvatarRing username={p.username} url={p.profilePic} size={32} /> {p.username}
            </ButtonBase>
          ))}
        </div>
      </div>
      <TextField
        label="Edit Caption"
        value={newCaption}
        onChange={captionChangeHandler}
        fullWidth
        multiline
        rows={4}
      />
      {postType === 'CATEGORY' && (
        <>
          <TextField
            required
            label="Post title"
            value={newTitle}
            onChange={titleChangeHandler}
            fullWidth
          />
          <TextField
            required
            fullWidth
            label="Post related URL"
            value={newLink}
            onChange={linkChangeHandler}
          />
        </>
      )}
      <div>
        <Button label="cancel" variant="text" onClick={handleClose} />
        <Button label="save" loading={isSubmitting} type="submit" />
      </div>
    </form>
  )

  return (
    <Popup open={showEdit} onClose={handleClose}>
      {options}
    </Popup>
  )
}

export default EditOptionPopup
