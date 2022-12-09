import http from '../../config/http'

import type { PaginationResponse_, PaginationParams_ } from '../../types'

type BioFetchParams_ = PaginationParams_ & {
  search: string
  signal?: AbortSignal
}

type Bio_ = {
  _id: string
  name: string
  src: string
  meaning: string
  price: number
}

type GetAllRes_ = PaginationResponse_ & {
  data: Bio_[]
}

//controller
const fetchAllBios = ({ search, signal, ...params }: BioFetchParams_) => {
  const url = !search ? '/user/bios' : `/user/bios/${search}`

  return http.get<GetAllRes_>(url, { params, signal })
}

const getOwnedBios = ({ search, signal, ...params }: BioFetchParams_) => {
  const url = !search ? '/user/bios-owned' : `/user/bios-owned${search}`

  return http.get<GetAllRes_>(url, { params, signal })
}

const getActiveBio = () => http.get<Bio_>('/user/bio-active')

const unlockBio = (bioId: string) => http.post(`/user/bio-own/${bioId}`)

const selectBio = (bio: Bio_) => http.post(`/user/set-bio/${bio._id}`)

const unlockAndSelectBio = (bioId: string) =>
  http.post(`/user/bio-own/${bioId}`).then(() => http.post(`/user/set-bio/${bioId}`))

// routes
const bioRoutes = {
  getAll: fetchAllBios,
  getOwned: getOwnedBios,
  currentBio: getActiveBio,
  unlock: unlockBio,
  select: selectBio,
  unlockAndSelect: unlockAndSelectBio
}

export default bioRoutes
