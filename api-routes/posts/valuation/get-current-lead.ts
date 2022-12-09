import { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'
import valuationPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import storage from '../../../config/storage'
import { ValuationPostStatus_ } from '../../../types/valuation-post.type'

export type CurrentLead_ = {
  netWorth: number
  grossWorth: number
  highestValuer: {
    _id: string
    name: string
    username: string
    profilePic: string
  }
  postKeeper: string
  status: ValuationPostStatus_
  isAgreed: boolean
  isViewed: boolean
}

const refetchStatusList: readonly ValuationPostStatus_[] = ['ACTIVE', 'BUZZ', 'VALUED']

const useGetCurrentLead = ({
  postId,
  status,
  watch
}: {
  postId: string
  status: ValuationPostStatus_
  watch: boolean
}) => {
  const [key, store] = [getKeys.post.valuation.getLead(postId), storage.session]

  const setInterval = () => {
    if (watch) {
      if (refetchStatusList.some(s => s === status)) return 1000 * 3 // 👉 THREE SECONDS
      if (status === 'PRE-BUZZ') return 1000 * 60 // 👉 ONE MINUTE
    }
    return undefined
  }
  const data = store.get(key)

  return useQuery(key, () => valuationPostQueries.lead.get(postId), {
    select: (res: AxiosResponse<CurrentLead_, any>) => {
      store.add({ key, value: res })
      return res.data
    },
    initialData: data || undefined,
    refetchInterval: setInterval(),
    enabled: !!postId
  })
}

export default useGetCurrentLead
