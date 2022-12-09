export type Location_ = {
  type: string
  coordinates: number[]
}

export type Bio_ = {
  meaning: string
  name: string
  src: string
  _id: string
}

export type Gender_ = 'MALE' | 'FEMALE' | 'OTHERS'

export type Profile_ = {
  _id: string
  name: string
  username: string
  email: string
  profilePic: string
  location: Location_
  place: string
  country: string
  countryCode: string
  dateOfBirth: Date
  gender: Gender_
  isVerified: boolean
  isPrivate: boolean
  referralCode: string
  bio: Omit<Bio_, '_id'>
  authType: 'gmail-p' | 'gmail' | 'email'
}

export type Suggestion_ = {
  _id: string
  name: string
  gender: Gender_
  username: string
  profilePic: string
  categories: number
}

export type FetchSuggestionsParams_ = {
  page: number
  size: number
}

export type FetchSuggestions_ = {
  data: Suggestion_[]
  pages: number
  currentPage: number
}
