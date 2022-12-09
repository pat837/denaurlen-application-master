import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import type { CurrentLead_ } from './get-current-lead'
import type { ErrorCallback_, SuccessCallback_ } from '../../../types'

type UseViewValuationPostParams_ = {
  callbacks: {
    success: SuccessCallback_
    error: ErrorCallback_
  }
}
type Res_ = AxiosResponse<{ viewsCount: number; agreedCount: number }, any>

const useViewValuationPost = ({ callbacks }: UseViewValuationPostParams_) =>
  useMutation(queries.viewPost, {
    onSuccess: (data, variables, context) => {
      const key = getKeys.post.valuation.getLead(variables)
      const countsKey = getKeys.post.valuation.getViewCounts(variables)

      const countsData = queryClient.getQueryData<Res_>(countsKey)
      const queryData = queryClient.getQueryData<AxiosResponse<CurrentLead_, any>>(key)

      queryClient.setQueryData(
        countsKey,
        countsData === undefined
          ? undefined
          : {
              ...countsData,
              data: {
                ...countsData.data,
                viewsCount: countsData.data.viewsCount + 1
              }
            }
      )

      queryClient.setQueryData(
        key,
        queryData === undefined
          ? undefined
          : { ...queryData, data: { ...queryData.data, isViewed: true } }
      )
      callbacks.success()
      queryClient.invalidateQueries(key)
      queryClient.invalidateQueries(countsKey)
    },
    onError: (error, variables, context) => {
      callbacks.error()
    }
  })

export default useViewValuationPost
