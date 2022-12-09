import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import { ErrorCallback_, SuccessCallback_ } from '../../../types'
import { CurrentLead_ } from './get-current-lead'

type UseInfiniteHandler_ = {
  type: 'INFINITE' | 'REVERT'
  callback: {
    success: SuccessCallback_
    error: ErrorCallback_
  }
}

const query = {
  INFINITE: queries.infinite,
  REVERT: queries.revert
}

const useRevaluationHandler = ({ type, callback }: UseInfiniteHandler_) => useMutation(query[type], {
  onSuccess: (response, variables, _context) => {
    const key = getKeys.post.valuation.getLead(variables.postId)

    const data = queryClient.getQueryData<AxiosResponse<CurrentLead_, any>>(key)

    queryClient.setQueryData(
      key,
      !data ? data : { ...data, data: { ...data.data, status: 'PRE-BUZZ' } }
    )

    callback.success(response)
  },
  onError: (error, _variables, _context) => {
    callback.error(error)
  },
  onSettled(_data, _error, variables, _context) {
    queryClient.invalidateQueries(getKeys.post.valuation.getLead(variables.postId))
  }
})

export default useRevaluationHandler
