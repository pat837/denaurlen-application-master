import router from 'next/router'

import ValuedPostScreen from '../../../components/screens/valued-post.screen'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'

const ValuationPostsViewPage = () => {
  usePageTitle({ title: 'Valued Posts' })

  return (
    <div>
      <ValuedPostScreen username={(router.query?.username as string) || ''} />
    </div>
  )
}

ValuationPostsViewPage.Layout = HomeLayout

export default ValuationPostsViewPage
