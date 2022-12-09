import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

import ValuedPostScreen from '../../../components/screens/valued-post.screen'
import { ProfileContext } from '../../../contexts/profile.context'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'

const ValuationPostsViewPage = () => {
  const [{ profile }, router] = [useContext(ProfileContext), useRouter()]

  usePageTitle({ title: 'Valued Posts' })

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
      <ValuedPostScreen username={profile.username} />
    </div>
  )
}

ValuationPostsViewPage.Layout = HomeLayout

export default ValuationPostsViewPage
