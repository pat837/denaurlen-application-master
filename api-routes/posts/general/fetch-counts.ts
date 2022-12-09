import { useQuery } from 'react-query'
import generalPostQueries from '.'
import { queryClient } from '../../../config/query-client'
import getKeys from '../../../config/storage-keys'

const useFetchGeneralPostCounts = (postId: string) => ({
  ...useQuery(
    getKeys.post.general.getCounts(postId),
    () => generalPostQueries.getCounts({ postId }),
    {
      select: (res) => res.data,
      enabled: !!postId
    }
  ),
  invalidateQuery: () => queryClient.invalidateQueries(getKeys.post.general.getCounts(postId))
})

export default useFetchGeneralPostCounts
