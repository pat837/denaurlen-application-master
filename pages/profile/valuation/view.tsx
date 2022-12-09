import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

import HoldPostScreen from '../../../components/screens/hold-post.screen'
import ValuationPostScreen from '../../../components/screens/valuation-post.screen'
import ConditionalRender from '../../../components/ui/conditional-render'
import HideOnScroll from '../../../components/ui/hide-on-scroll'
import { ProfileContext } from '../../../contexts/profile.context'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'
import css from '../../../styles/pages/valuation/valuation-post.page.module.scss'

const ValuationPostsViewPage = () => {
  const [{ profile }, router] = [useContext(ProfileContext), useRouter()]

  const changeHandler = (type: 'HOLD' | 'DECLARED') => () => {
    router.replace({ pathname: router.pathname, query: type === 'HOLD' ? { hold: 'on' } : {} })
  }

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
    <div className={css.valuation_view}>
      <HideOnScroll>
        <div className={css.navigation_wrapper}>
          <div style={{ height: 'var(--appbar-height)' }} />
          <div className={css.navigation_section}>
            <input
              type="radio"
              name="tab"
              id="tab-0"
              checked={router.query?.hold !== 'on'}
              onChange={changeHandler('DECLARED')}
            />
            <input
              type="radio"
              name="tab"
              id="tab-1"
              checked={router.query?.hold === 'on'}
              onChange={changeHandler('HOLD')}
            />
            <nav className={router.query?.hold === 'on' ? css.tab2 : css.tab1}>
              <label htmlFor="tab-0">Collections</label>
              <label htmlFor="tab-1">Hold Posts</label>
            </nav>
          </div>
        </div>
      </HideOnScroll>
      <div className={css.fix} />
      <ConditionalRender condition={router.query?.hold === 'on'}>
        <HoldPostScreen />
        <ValuationPostScreen username={profile.username} />
      </ConditionalRender>
    </div>
  )
}

ValuationPostsViewPage.Layout = HomeLayout

export default ValuationPostsViewPage
