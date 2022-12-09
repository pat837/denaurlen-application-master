import { UseInfiniteQueryOptions, useInfiniteQuery, QueryKey } from 'react-query'
import valuationPostQueries from '.'
import getKeys from '../../../config/storage-keys'
import { queryClient } from '../../../config/query-client'
import storage from '../../../config/storage'
import { Comment_ } from '../../../types'
import { getNextPageParams } from '../../../utils'

export type GetCommentsForValuationPostResData_ = {
  page: number | string
  currentPage: number | string
  comments: Comment_[]
}

const useGetValuationPostComments = (postId: string, size: number = 30) => {
  const [key, store] = [getKeys.post.valuation.getComments(postId), storage.session]

  let options: Omit<UseInfiniteQueryOptions<any, any, Comment_[], string>, 'queryKey' | 'queryFn'> = {
    select: (res: any) => {
      store.add({ key, value: res })
      return {
        pageParams: res.pageParams,
        pages: res.pages.map((page: { data: GetCommentsForValuationPostResData_ }) => page.data.comments)
      }
    },
    getNextPageParam: (lastPage: { data: { currentPage: number; pages: number } }) => {
      return getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    },
    enabled: !!postId
  }

  const data = store.get(key)

  if (!!data) options = { ...options, initialData: data }

  return {
    ...useInfiniteQuery(
      key,
      ({ pageParam = 1 }) => valuationPostQueries.comment.get({ postId, page: pageParam, size }),
      options
    ),
    inValidate: () => {
      queryClient.invalidateQueries(key)
    }
  }
}

export default useGetValuationPostComments
