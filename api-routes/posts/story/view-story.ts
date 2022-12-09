import { useMutation } from 'react-query'
import queries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'

type UseViewStory_ = {
  username: string
  callback: {
    success: () => any
    error: () => any
  }
}

const useViewStory = ({ username, callback }: UseViewStory_) =>
  useMutation(queries.view, {
    onSettled: () => {
      queryClient.invalidateQueries(getKeys.story.getByUsername(username))
      queryClient.invalidateQueries(getKeys.story.isViewedAll(username))
    },
    onSuccess: callback.success,
    onError: callback.error
  })

export default useViewStory
