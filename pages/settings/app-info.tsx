import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { AnimatedLogo } from '../../components/splash-screen'
import { systemOptionsActions } from '../../data/actions'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/settings/app-info.module.scss'

type AppInfo_ = { name: string; version: string; author: string; note: string }

type ApplicationInfoPageProps_ = {
  appInfo: AppInfo_
}

const ApplicationInfoPage = ({ appInfo: data }: ApplicationInfoPageProps_) => {
  const dispatch = useDispatch()
  const [clickCount, setClickCounts] = useState(0)

  const clickHandler = () => {
    const count = clickCount + 1

    setClickCounts(count)
    if (count === 7) dispatch(systemOptionsActions.zenMode.activate())
  }

  usePageTitle({ title: 'App Info' })

  return (
    <div className={css.page}>
      <div className={css.wrapper}>
        <div className={css.icon}>
          <AnimatedLogo />
        </div>
        <h3 className={css.name}>
          {data?.name}
          <sup>BETA</sup>
        </h3>
        <span onClick={clickHandler} className={css.version}>
          version: <b>{data?.version}</b>
        </span>
        <p className={css.note}>{data?.note}</p>
        <span className={css.n}>
          <b>Note: </b>Some features might not work, as application is still in development
        </span>
      </div>
    </div>
  )
}

ApplicationInfoPage.Layout = HomeLayout

export const getStaticProps = async () => {
  const note =
    'This release is in preview. Features are noted as beta, pilot, or developer preview. This Beta Version does not represent the final stable version.'
  const author = 'Pranay kumar'
  try {
    const appInfo = require('/package.json')

    return {
      props: {
        appInfo: {
          name: appInfo?.name?.toUpperCase() || 'DENAURLEN',
          version: appInfo?.version || '',
          author,
          note
        }
      }
    }
  } catch (errorCount) {
    return { props: { appInfo: { name: 'DENAURLEN', version: '', author, note } } }
  }
}

export default ApplicationInfoPage
