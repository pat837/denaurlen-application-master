import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import { SuccessCallback_, ErrorCallback_ } from '../../../types'
import { CurrentLead_ } from './get-current-lead'

type UseAgreeToPlayParams_ = {
  callbacks: {
    success: SuccessCallback_
    error: ErrorCallback_
  }
}
type Res_ = AxiosResponse<{ viewsCount: number; agreedCount: number }, any>

const useAgreeToValuation = ({ callbacks }: UseAgreeToPlayParams_) =>
  useMutation(queries.agreeToPlay, {
    onSuccess: (data, variables, context) => {
      const key = getKeys.post.valuation.getLead(variables)
      const countsKey = getKeys.post.valuation.getViewCounts(variables)

      const countsData = queryClient.getQueryData<Res_>(countsKey)
      const queryData = queryClient.getQueryData<AxiosResponse<CurrentLead_, any>>(key)

      queryClient.setQueryData(countsKey, countsData === undefined ? undefined : {
        ...countsData,
        data: {
          ...countsData.data,
          agreedCount: countsData.data.agreedCount + 1
        }
      })

      queryClient.setQueryData(
        key,
        queryData === undefined
          ? undefined
          : { ...queryData, data: { ...queryData.data, isAgreed: true } }
      )
      callbacks.success(data)
      queryClient.invalidateQueries(key)
      queryClient.invalidateQueries(countsKey)
    },
    onError: () => {
      callbacks.error()
    }
  })

export default useAgreeToValuation
