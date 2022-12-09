import { createContext, ReactNode, useContext } from 'react'

import useGetOwnedCategories from '../api-routes/categories/get-owned-categories'
import useGetProfile from '../api-routes/profile-queries/fetch-profile'
import { AuthContext } from './auth.context'

import type { categoriesListType } from '../types'
import type { Profile_ } from '../types/profile.type'

type ProfileContextType = {
  profile: Profile_
  refetchProfile: (...args: any) => any
  isLoading: boolean
  isError: boolean
  isFetching: boolean
  categories: categoriesListType
}

const PROFILE: Profile_ = {
  location: {
    type: 'Point',
    coordinates: []
  },
  name: '',
  email: '',
  username: '',
  profilePic: '',
  gender: 'MALE',
  dateOfBirth: new Date(),
  place: '',
  country: '',
  isPrivate: false,
  isVerified: false,
  countryCode: '',
  referralCode: '',
  bio: {
    name: '',
    src: '',
    meaning: ''
  },
  _id: '',
  authType: 'email'
}

const ProfileContext = createContext<ProfileContextType>({
  profile: PROFILE,
  refetchProfile: () => null,
  isLoading: true,
  isError: false,
  isFetching: false,
  categories: []
})

const ProfileContextProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext)

  const {
    data: profile,
    invalidateQuery: refetch,
    isError: isProfileError,
    isLoading: isProfileLoading,
    isFetching: isProfileFetching
  } = useGetProfile(user.username, true)

  const {
    data: categories,
    isError: isCategoriesError,
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
    refetch: refetchCategories
  } = useGetOwnedCategories(user.username, true)

  return (
    <ProfileContext.Provider
      value={{
        profile: profile || PROFILE,
        refetchProfile: () => {
          refetch()
          refetchCategories()
        },
        isError: isProfileError || isCategoriesError,
        isFetching: isProfileFetching || isCategoriesFetching,
        isLoading: isProfileLoading || isCategoriesLoading,
        categories: categories || []
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export { ProfileContext }
export default ProfileContextProvider
