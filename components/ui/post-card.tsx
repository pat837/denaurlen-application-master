import CategoryPostCard from './category-post/card'
import GeneralPostCard from './general-post/card'
import ValuationPostCard from './valuation-post/valuation-post-card'

import type { GeneralPost_ } from '../../types/general-post.types'
import type { CategoryPost_ } from '../../types/category-post.type'
import type { ValuationPost_ } from '../../types/valuation-post.type'

type PostCardProps_ =
  | (ValuationPost_ & { postType: 'VALUATION' })
  | (GeneralPost_ & { postType: 'GENERAL' })
  | (CategoryPost_ & { postType: 'TOP10'; priority: number })

const PostCard = ({ ...post }: PostCardProps_) => {
  switch (post.postType) {
    case 'VALUATION':
      return <ValuationPostCard {...post} />
    case 'GENERAL':
      return <GeneralPostCard {...post} />
    case 'TOP10':
      return <CategoryPostCard {...post} />
    default:
      return <></>
  }
}

export default PostCard
