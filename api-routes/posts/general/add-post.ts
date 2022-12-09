import { useMutation } from 'react-query'
import generalPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'
import { ErrorCallback_, SuccessCallback_ } from '../../../types'

type UseAddGeneralPost_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
  username: string
}

const useAddGeneralPost = ({ onSuccess, onError, username }: UseAddGeneralPost_) =>
  useMutation(generalPostQueries.add, {
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(getKeys.post.counts(username), (oldQueryData: any) => {
        return !oldQueryData
          ? oldQueryData
          : {
              ...oldQueryData,
              data: {
                ...oldQueryData.data,
                generalPosts: oldQueryData.data.generalPosts + 1
              }
            }
      })
      queryClient.invalidateQueries(getKeys.post.general.get(username))
      queryClient.invalidateQueries(getKeys.post.counts(username))
      onSuccess()
    },
    onError: () => {
      onError()
    }
  })

export default useAddGeneralPost
