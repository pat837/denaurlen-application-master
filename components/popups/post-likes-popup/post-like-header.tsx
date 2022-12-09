import { useEffect } from 'react'

import useGetCategoryPostCounts from '../../../api-routes/posts/category/fetch-post-counts'
import useFetchGeneralPostCounts from '../../../api-routes/posts/general/fetch-counts'
import useGetValuationPostCounts from '../../../api-routes/posts/valuation/get-post-counts'
import { numberFormat } from '../../../utils'
import InterestedIcon from '../../icons/interested.icon'
import LikedIcon from '../../icons/liked.icon'
import css from './post-popup.module.scss'

type HeadSectionProps_ = {
  postId: string
}

const GeneralPostHeader = ({ postId }: HeadSectionProps_) => {
  const { data, invalidateQuery } = useFetchGeneralPostCounts(postId)

  useEffect(() => {
    return () => {
      invalidateQuery()
    }
  }, [invalidateQuery])

  return (
    <>
      <section>
        <LikedIcon />
        <h3>
          {numberFormat(data?.likesCount || 0)} Like{(data?.likesCount || 0) > 1 && 's'}
        </h3>
      </section>
      <h6 className={css.heading}>Liked by</h6>
    </>
  )
}
const ValuationPostHeader = ({ postId }: HeadSectionProps_) => {
  const { data, refetch } = useGetValuationPostCounts({ postId })

  useEffect(() => {
    return () => {
      refetch()
    }
  }, [refetch])

  return (
    <>
      <section>
        <InterestedIcon />
        <h3>
          {numberFormat(data?.interestsCount || 0)} Interest{(data?.interestsCount || 0) > 1 && 's'}
        </h3>
      </section>
      <h6 className={css.heading}>Interested by</h6>
    </>
  )
}
const CategoryPostHeader = ({ postId }: HeadSectionProps_) => {
  const { data, refetch } = useGetCategoryPostCounts(postId)

  useEffect(() => {
    return () => {
      refetch()
    }
  }, [refetch])

  return (
    <>
      <section>
        <InterestedIcon />
        <h3>
          {numberFormat(data?.interestsCount || 0)} Interest{(data?.interestsCount || 0) > 1 && 's'}
        </h3>
      </section>
      <h6 className={css.heading}>Interested by</h6>
    </>
  )
}

export { CategoryPostHeader, GeneralPostHeader, ValuationPostHeader }
