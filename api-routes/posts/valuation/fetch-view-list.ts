import { useInfiniteQuery } from 'react-query'
import queries from '.'
import getKeys from '../../../config/storage-keys'

type UseFetchValuationViewListParams_ = {
  postId: string
  size?: number
}
type Params_ = UseFetchValuationViewListParams_

const useFetchValuationViewList = ({ postId, size = 20 }: Params_) =>
  useInfiniteQuery(
    getKeys.post.valuation.getViewList(postId),
    ({ pageParam = 1 }) => queries.viewList({ postId, page: pageParam, size }),
    {
      select: (response) => ({
        ...response,
        pages: response.pages.map((page) => page.data.data)
      }),
      enabled: !!postId
    }
  )

export default useFetchValuationViewList
