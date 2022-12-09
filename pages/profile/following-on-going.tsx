import { useRouter } from 'next/router'
import { useEffect } from 'react'

import usePageTitle from '../../hooks/page-title.hook'
import OngoingValuationPostScreen from './../../components/screens/following-ongoing.screen'
import HomeLayout from './../../layouts/home.layout'

const FollowingOnGoingPage = () => {
  const router = useRouter()

  usePageTitle({ title: 'Valuation Posts' })

  useEffect(() => {
    const postId = router.query?.postId

    if (!!postId) {
      const post = document.getElementById(postId.toString())
      if (!!post) {
        const headerOffset = 80
        const postPosition = post.getBoundingClientRect().top
        const offsetPosition = postPosition + window.pageYOffset - headerOffset
        window.scrollTo({ top: offsetPosition, behavior: 'auto' })
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }, [router.query?.postId])

  return (
    <div>
      <OngoingValuationPostScreen />
    </div>
  )
}

FollowingOnGoingPage.Layout = HomeLayout

export default FollowingOnGoingPage
