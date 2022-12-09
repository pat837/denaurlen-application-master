import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

import OngoingValuationPostScreen from '../../../components/screens/valuation-ongoing.screen'
import { ProfileContext } from '../../../contexts/profile.context'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'

const OngoingValuationPostPage = () => {
  const [{ profile }, router] = [useContext(ProfileContext), useRouter()]

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
      <OngoingValuationPostScreen username={profile.username} />
    </div>
  )
}

OngoingValuationPostPage.Layout = HomeLayout

export default OngoingValuationPostPage
