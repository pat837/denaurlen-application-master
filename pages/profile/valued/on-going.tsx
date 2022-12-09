import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

import OngoingValuedPostScreen from '../../../components/screens/valued-ongoing.screen'
import { ProfileContext } from '../../../contexts/profile.context'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'

const OngoingValuedPostPage = () => {
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
      <OngoingValuedPostScreen username={profile.username} />
    </div>
  )
}

OngoingValuedPostPage.Layout = HomeLayout

export default OngoingValuedPostPage
