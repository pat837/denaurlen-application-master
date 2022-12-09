import { LocalizationProvider, MobileDatePicker } from '@mui/lab'
import DateAdopter from '@mui/lab/AdapterMoment'
import { Avatar, MenuItem, Select, TextField } from '@mui/material'
import { Canceler } from 'axios'
import moment from 'moment'
import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useEditProfile from '../../api-routes/profile-queries/edit-profile'
import userService from '../../api-routes/user'
import { getMediaURL } from '../../utils/get-url'
import { AuthContext } from '../../contexts/auth.context'
import { profilePageActions } from '../../data/actions'
import useFormField from '../../hooks/form-field.hook'
import css from '../../styles/profile-card.module.scss'
import { storeType } from '../../types'
import Button from '../ui/button'
import DialogBox from '../ui/dialog-box'

type EditProfileFromProps = {
  refetch: (...args: any) => any
}

const EditProfileForm = ({ refetch }: EditProfileFromProps) => {
  const { isEditProfileOpen: isOpen, editProfile: user } = useSelector((store: storeType) => store.profilePage)
  const dispatch = useDispatch()

  const { user: authUser, setUser } = useContext(AuthContext)

  const name = useFormField({
    initialValue: user.name,
    required: true,
    name: 'full name',
    regExMessage: 'Name should contain only alphabets and space',
    regex: /^[A-Za-z\s]{0,}$/
  })
  const username = useFormField({
    initialValue: user.username,
    required: true,
    name: 'username',
    regex: /^[A-Za-z][A-Za-z0-9._]{3,20}$/,
    regExMessage: '',
    onlyLowercase: true,
    length: 20
  })

  const [form, setForm] = useState({
    dob: user.dateOfBirth,
    gender: user.gender
  })
  const [place, setPlace] = useState(user.place || '')
  const [location, setLocation] = useState<number[]>(user.location.coordinates)
  const [city, setCity] = useState(user.place || '')
  const [country, setCountry] = useState(user.country || '')
  const [countryCode, setCountryCode] = useState(user.countryCode || '')
  const placeRef = useRef<null | HTMLInputElement>(null)
  const [locationError, setLocAError] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const setLoader = () => setIsSubmitting(true)
  const removeLoader = () => setIsSubmitting(false)

  // const setCurrent

  useEffect(() => {
    let cancel: Canceler = () => {}
    if (user.username !== username.value)
      userService
        .usernameExists(username.value)
        .then(({ data }) => {
          if (!username.params.error && data.alreadyExists)
            username.setError({ error: true, helperText: 'Username is already taken' })
        })
        .catch(() => null)

    return () => cancel()
  }, [user.username, username])

  useEffect(() => {
    if (typeof google !== 'undefined') {
      const initializer = () => {
        if (!!placeRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(placeRef?.current, {
            types: ['geocode']
          })

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            const [latitude, longitude] = [place.geometry?.location?.lat(), place.geometry?.location?.lng()]

            if (!latitude || !longitude || !place.formatted_address || !place.address_components) return null

            place.address_components.forEach(address => {
              if (address.types.includes('country')) {
                setCountryCode(address.short_name)
                setCountry(address.long_name)
              }
            })
            setLocation([longitude, latitude])
            setCity(place.formatted_address)
          })
        }
      }
      initializer()
    }
  }, [place])

  const closeHandler = () => {
    dispatch(profilePageActions.closeEditProfile())
  }

  const handleChangeProfile = () => {
    dispatch(profilePageActions.openEditProfilePic())
  }

  const dobChangeHandle = (newValue: any) => setForm({ ...form, dob: newValue })

  const { mutate: editProfile } = useEditProfile({
    onSuccess: data => {
      setUser({ ...authUser, username: data.username })
      removeLoader()
      closeHandler()
    },
    onError: ({ response }) => {
      const message = response.data.message
      removeLoader()
      alert(message)
    }
  })

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const age = moment().diff(form.dob, 'y')

    if (!placeRef.current?.value) return setLocAError('please enter your location')

    if (name.value.length < 2)
      return name.setError({ error: true, helperText: 'Name should contain at least 2 characters' })
    if (name.value.length > 30)
      return name.setError({ error: true, helperText: 'Name should contain upto 30 characters' })

    if (!username.value || !name.value || !form.gender || !form.dob || age < 13 || age > 80) return null
    if (username.params.error || name.params.error) return null

    setLoader()
    editProfile({
      username: username.value,
      name: name.value,
      gender: form.gender,
      dateOfBirth: form.dob,
      location: {
        type: 'Point',
        coordinates: location
      },
      place: city,
      country: country,
      countryCode: countryCode
    })
  }

  const titleSection = (
    <div className={css['edit-profile-title-section']}>
      <h3>Edit Profile</h3>
      <form autoComplete="off" id="edit-profile-form" onSubmit={submitHandler}>
        <Button label="cancel" variant="text" onClick={closeHandler} />
        <Button label="save" loading={isSubmitting} type="submit" />
      </form>
    </div>
  )

  return (
    <DialogBox
      className={css['edit-profile-form-wrapper']}
      isOpen={isOpen}
      onClose={closeHandler}
      titleSection={titleSection}
      disableIndexZ
    >
      <div className={css['form-wrapper']}>
        <div className={css['profile-wrapper']}>
          <Avatar imgProps={{ loading: 'lazy' }} className={css.profile} src={getMediaURL(user.profilePic)} />
          <div>
            <p>{user.username}</p>
            <a onClick={handleChangeProfile}>
              {!user.profilePic ? 'Add Profile Picture' : 'Update Profile Picture'}
            </a>
          </div>
        </div>
        <fieldset className={css['form']} form="edit-profile-form">
          <div className={css['form-control']}>
            <label htmlFor="name">Full Name</label>
            <TextField id="name" {...name.params} required />
          </div>
          <div className={css['form-control']}>
            <label htmlFor="location">Location</label>
            <TextField
              id="location"
              required
              inputRef={placeRef}
              defaultValue={city}
              type="text"
              onChange={e => setPlace(e.target.value)}
              helperText={!placeRef.current?.value ? locationError || undefined : undefined}
            />
          </div>
          <div className={css['form-control']}>
            <label htmlFor="username">username</label>
            <TextField id="username" {...username.params} required />
          </div>
          <div className={css['form-control']}>
            <label>Date of Birth</label>
            <LocalizationProvider dateAdapter={DateAdopter}>
              <MobileDatePicker
                maxDate={moment().subtract(13, 'y')}
                minDate={moment().subtract(80, 'y')}
                showToolbar
                inputFormat="DD/MM/YYYY"
                value={form.dob}
                onChange={dobChangeHandle}
                renderInput={params => <TextField required {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className={css['form-control']}>
            <label htmlFor="email">email</label>
            <TextField id="email" disabled value={user.email} />
          </div>
          <div className={css['form-control']}>
            <label htmlFor="gender">Gender</label>
            <Select
              id="gender"
              value={form.gender}
              onChange={e => {
                const value = e.target.value as string
                if (['MALE', 'FEMALE', 'OTHERS'].includes(value))
                  setForm(state => ({ ...state, gender: value as 'MALE' | 'FEMALE' | 'OTHERS' }))
              }}
              required
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHERS">Others</MenuItem>
            </Select>
          </div>
        </fieldset>
      </div>
    </DialogBox>
  )
}

export default EditProfileForm
