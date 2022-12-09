import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import storyQueries from '.'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'

type SuccessCallback_ = (value?: AxiosResponse<any, any>) => void | PromiseLike<void>
type ErrorCallback_ = (reason?: any) => PromiseLike<never> | void

type UseAddValuationPost_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
  username: string
}

const useSpendCoinsOnStory = ({ onSuccess, onError, username }: UseAddValuationPost_) => {
  return useMutation(storyQueries.premium.spendCoins, {
    onSuccess: () => {
      queryClient.invalidateQueries(getKeys.story.premium.get(username))
      onSuccess()
    },
    onError: () => {
      queryClient.invalidateQueries(getKeys.story.premium.get(username))
      onError()
    },
    onMutate: (variable) => {
      queryClient.setQueryData(getKeys.story.premium.get(username), (oldQueryData: any) => ({
        ...oldQueryData,
        data: {
          ...oldQueryData.data,
          data: oldQueryData.data.data.map((story: any) => ({
            ...story,
            stats:
              variable === story._id
                ? {
                    isViewed: true,
                    isSpend: true,
                    isAgreed: false
                  }
                : story.stats
          }))
        }
      }))
    }
  })
}

export default useSpendCoinsOnStory
