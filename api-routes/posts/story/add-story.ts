import { AxiosResponse } from 'axios'
import { useMutation } from 'react-query'
import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'
import { ErrorCallback_, SuccessCallback_ } from '../../../types'
import { FetchIsViewedStory_ } from '../../../types/story.type'

type UseAddGeneralPost_ = {
  callback: {
    success: SuccessCallback_
    error: ErrorCallback_
  }
  username: string
}

type isViewed_ = AxiosResponse<FetchIsViewedStory_, any>[]

const useAddGeneralStory = ({ callback, username }: UseAddGeneralPost_) =>
  useMutation(queries.general.add, {
    onMutate: () => {
      const key = getKeys.story.isViewedAll(username)

      const data = queryClient.getQueryData<isViewed_>(key)

      queryClient.setQueryData(
        key,
        !data ? undefined : data.map((s) => ({ ...s, data: { isViewed: false } }))
      )

      return { fallbackData: data }
    },
    onSuccess: () => {
      callback.success()
    },
    onError(error, variables, context: any) {
      queryClient.setQueryData(getKeys.story.isViewedAll(username), context)
      callback.error()
    },
    onSettled: () => {
      queryClient.invalidateQueries(getKeys.story.getByUsername(username))
    }
  })

export default useAddGeneralStory
