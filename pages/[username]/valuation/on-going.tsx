import router from 'next/router'

import OngoingValuationPostScreen from '../../../components/screens/valuation-ongoing.screen'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'

const OthersOngoingValuationPostsViewPage = () => {
  usePageTitle({ title: 'Valuation Posts' })

  return (
    <div>
      <OngoingValuationPostScreen username={(router.query?.username as string) || ''} />
    </div>
  )
}

OthersOngoingValuationPostsViewPage.Layout = HomeLayout

export default OthersOngoingValuationPostsViewPage
