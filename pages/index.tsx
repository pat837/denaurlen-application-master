import { useMediaQuery } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { useStopwatch } from 'react-timer-hook'

import WelcomeMobile from '../assets/welcome-mobile'
import Welcome1 from '../assets/welcome-one'
import Welcome3 from '../assets/welcome-three'
import Welcome2 from '../assets/welcome-two'
import Button from '../components/ui/button'
import constants from '../config/constants'
import css from '../styles/pages/index.module.scss'

import type { landingPageSectionType } from '../types'

const sectionList: landingPageSectionType[] = [
  {
    id: 1,
    title: 'Activity to Infinity',
    Img: Welcome1
  },
  {
    id: 2,
    title: 'One Platform Multiple Persona',
    Img: Welcome2
  },
  {
    id: 3,
    title: 'Real You, Rewards For You!',
    Img: Welcome3
  }
]

const SectionCard = ({ id, title, Img }: landingPageSectionType) => (
  <div className={css.card}>
    <div className={css.heading}>
      <span>{id}</span>
      <p>{title}</p>
    </div>
    <Img />
  </div>
)

const HeadSection = () => (
  <Head>
    <title>Denaurlen</title>
  </Head>
)

const LandingPage = () => {
  const isDesktop = useMediaQuery('(min-width: 1140px)')

  const { query } = useRouter()

  useEffect(() => {
    if (!!query && !!query.rc) {
      window.sessionStorage.setItem(constants.REFERRAL_CODE, query.rc.toString())
    } else {
      window.sessionStorage.clear()
    }
  }, [query])

  return (
    <>
      <HeadSection />
      {isDesktop ? <LandingPageForDesktop /> : <LandingPageForMobile />}
    </>
  )
}

const LandingPageForDesktop: FC = () => {
  const router = useRouter()

  const { seconds, pause } = useStopwatch({ autoStart: true })

  useEffect(() => {
    const referralCode = window.sessionStorage.getItem(constants.REFERRAL_CODE)

    const link = referralCode ? '/signup' : '/login'

    if (seconds >= 4) {
      pause()
      router.push(link)
    }
  }, [pause, router, seconds])

  return (
    <>
      <div className={css.wrapper_desktop}>
        <div className={css.title}>
          <h1>
            Welcome to DENAURLEN<sup>BETA</sup>
          </h1>
          <p>Gamify With Smart Savvy Social Network</p>
        </div>
        <div className={css.section}>
          {sectionList.map(card => (
            <SectionCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </>
  )
}

const LandingPageForMobile = () => {
  const navigate = useRouter()

  return (
    <div className={css.wrapper_mobile}>
      <div>
        <div className={css.title}>
          <h1>
            DENAURLEN<sup>BETA</sup>
          </h1>
          <p>Know Yourself First!</p>
        </div>
        <WelcomeMobile />
        <div className={css.button_grp}>
          <Button label="sign in" square onClick={() => navigate.push('/login')} />
          <Button label="sign up" square variant="outline" onClick={() => navigate.push('/signup')} />
        </div>
      </div>
    </div>
  )
}

LandingPage.isInSecure = true

export default LandingPage
