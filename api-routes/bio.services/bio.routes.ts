import { AxiosResponse } from 'axios'
import http from '../../config/http'

import type { PaginationResponse_, PaginationParams_ } from '../../types'

type FetchBiosParams = PaginationParams_ & {
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

type GetAllRes_ = PaginationResponse_ & { data: Bio_[] }

type FetchAllBios = (params: FetchBiosParams) => Promise<AxiosResponse<GetAllRes_, any>>

type FetchOwnedBios = (params: FetchBiosParams) => Promise<AxiosResponse<GetAllRes_, any>>

type FetchActiveBio = (signal?: AbortSignal) => Promise<AxiosResponse<Bio_, any>>

type UnlockOrActivateBio = (params: { bioId: string }) => Promise<AxiosResponse<any, any>>

type UnlockBio = UnlockOrActivateBio
type ActivateBio = UnlockOrActivateBio
type UnlockAndActivateBio = UnlockOrActivateBio

/**
 * Bio Routes
 * * getAll: Returns the promise of axios with response containing list of bios which are not owned by the user.
 * * getOwned: Returns the promise of axios with response containing list of bios which are owned by the user.
 * * getCurrentOne: Returns the promise of axios with response containing bio which is been using by the user.
 * * unlock: Unlocks the bio of which the id is passed as parameter.
 * * activate: Activate the bio of which the id is passed as parameter.
 * * unlockAndActivateBio: Unlocks & activate the bio of which the id is passed as parameter.
 */
abstract class BioRoutes {
  private static readonly getBioURL = 'user/bios'
  private static readonly getOwnedBiosURL = 'user/bios-owned'
  private static readonly getActiveBioURL = 'user/bio-active'
  private static readonly unlockBioURL = 'user/bio-own'
  private static readonly activateBioURL = 'user/set-bio'

  /**
   * Returns the promise of axios with response containing list of bios which are not owned by the user.
   * @method
   * @param params.search String containing search word.
   * @param params.signal AbortSignal for fetch request.
   * @param params.page  current page number for pagination.
   * @param params.size  Size docs or records per page for pagination.
   */
  static getAll: FetchAllBios = ({ search, signal, ...params }) => {
    return http.get(`${this.getBioURL}/${search}`, { params, signal })
  }

  /**
   * Returns the promise of axios with response containing list of bios which are owned by the user.
   * @method
   * @param params.search String containing search word.
   * @param params.signal AbortSignal for fetch request.
   * @param params.page  current page number for pagination.
   * @param params.size  Size docs or records per page for pagination.
   */
  static getOwned: FetchOwnedBios = ({ search, signal, ...params }) => {
    return http.get(`${this.getOwnedBiosURL}/${search}`, { params, signal })
  }

  /**
   * Returns the promise of axios with response containing bio which is been currently using by the user.
   * @method
   * @param signal AbortSignal for fetch request.
   */
  static getActive: FetchActiveBio = signal => http.get(this.getActiveBioURL, { signal })

  /**
   * Unlocks the bio of which the id is passed as parameter.
   * @method
   * @param params.signal AbortSignal for fetch request.
   * @param params.bioId Id of the bio which is to be unlocked.
   */
  static unlock: UnlockBio = ({ bioId }) => http.post(`${this.unlockBioURL}/${bioId}`)

  /**
   * Activates the bio of which the id is passed as parameter.
   * @method
   * @param params.signal AbortSignal for fetch request.
   * @param params.bioId Id of the bio which is to be unlocked.
   */
  static activate: ActivateBio = ({ bioId }) => http.post(`${this.activateBioURL}/${bioId}`)

  /**
   * Unlocks & activates the bio of which the id is passed as parameter.
   * @method
   * @param params.bioId Id of the bio which is to be unlocked & activate.
   */
  static unlockAndActivate: UnlockAndActivateBio = params => this.unlock(params).then(() => this.activate(params))
}

export default BioRoutes
