import { ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SwipeableViews from 'react-swipeable-views'

import PlayerStatsScreen from '../../components/screens/player-stats.screen'
import UploaderStatsScreen from '../../components/screens/uploader-stats.screen'
import { statsboardActions } from '../../data/actions'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/statsboard/statsboard.module.scss'
import { storeType } from '../../types'

const Screen = ({ onSwipe }: { onSwipe: (index: number) => void }) => {
  const { statsToShow } = useSelector((s: storeType) => s.statsboardState)

  return (
    <SwipeableViews index={statsToShow === 'PLAYER' ? 1 : 0} onChangeIndex={onSwipe}>
      <UploaderStatsScreen />
      <PlayerStatsScreen />
    </SwipeableViews>
  )
}

const StatsboardPage = () => {
  const [dispatch, { statsToShow }] = [useDispatch(), useSelector((s: storeType) => s.statsboardState)]

  usePageTitle({ title: 'Statsboard' })

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value === 'UPLOADER' || value === 'PLAYER') dispatch(statsboardActions.statsToShow(value))
  }

  const swipeHandler = (index: number) => {
    dispatch(statsboardActions.statsToShow(index === 1 ? 'PLAYER' : 'UPLOADER'))
  }

  return (
    <div className={css.page_wrapper}>
      <div className={css.page}>
        <div className={css.navigation_section}>
          <input
            type="radio"
            name="uploader-stats"
            id="uploader-stats"
            value="UPLOADER"
            checked={statsToShow === 'UPLOADER'}
            onChange={changeHandler}
          />
          <input
            type="radio"
            name="player-stats"
            id="player-stats"
            value="PLAYER"
            checked={statsToShow === 'PLAYER'}
            onChange={changeHandler}
          />
          <nav className={statsToShow === 'PLAYER' ? css.player : css.uploader}>
            <label htmlFor="uploader-stats">Uploader</label>
            <label htmlFor="player-stats">Player</label>
          </nav>
        </div>
        <Screen onSwipe={swipeHandler} />
      </div>
    </div>
  )
}

StatsboardPage.Layout = HomeLayout

export default StatsboardPage
