import { useMutation } from 'react-query'
import valuationPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'
import { ErrorCallback_, SuccessCallback_ } from '../../../types'

type UseInterestValuationPost_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useInterestValuationPost = ({ onError, onSuccess }: UseInterestValuationPost_) => {
  return useMutation(valuationPostQueries.interestPost, {
    onMutate: (variables) => {
      const key = getKeys.post.valuation.counts(variables)

      const previousTodos = queryClient.getQueryData(key)

      queryClient.setQueryData(key, (oldQueryData: any) => {
        return {
          ...oldQueryData,
          data: {
            ...oldQueryData?.data,
            isInterested: true,
            interestsCount: oldQueryData?.data.interestsCount + 1
          }
        }
      })

      return { previousTodos }
    },
    onSuccess: (data, variables, context) => {
      
      queryClient.invalidateQueries(getKeys.post.valuation.counts(variables))
      onSuccess()
    },
    onError: (error, variables, context: any) => {
      
      queryClient.setQueryData(
        getKeys.post.valuation.counts(variables),
        () => !context?.previousTodos ? context : context.previousTodos
      )
      onError()
    }
  })
}

export default useInterestValuationPost
