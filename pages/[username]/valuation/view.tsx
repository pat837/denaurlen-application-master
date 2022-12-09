import router from 'next/router'

import ValuationPostScreen from '../../../components/screens/valuation-post.screen'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'

const ValuationPostsViewPage = () => {
  usePageTitle({ title: 'Valuation Posts' })

  return (
    <div>
      <ValuationPostScreen username={(router.query?.username as string) || ''} />
    </div>
  )
}

ValuationPostsViewPage.Layout = HomeLayout

export default ValuationPostsViewPage
