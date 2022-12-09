import { ButtonBase, Drawer, IconButton } from '@mui/material'
import moment from 'moment'
import { useRef, useState } from 'react'
import Confetti from 'react-confetti'

import useCollectReward from '../../../api-routes/rewards/collect-reward'
import useGetDailyRewards from '../../../api-routes/rewards/get-daily-rewards'
import useIsDailyLoginRewardCollected from '../../../api-routes/rewards/is-collected'
import usePopup from '../../../hooks/popup.hook'
import CheckIcon from '../../icons/check.icon'
import InfoIcon from '../../icons/info.icon'
import RewardIcon from '../../icons/reward.icon'
import XIcon from '../../icons/x.icon'
import ConditionalRender from '../../ui/conditional-render'
import { CountDown } from '../../ui/ValuationPost/ValuationPostCard2'
import css from './daily-login-rewards.module.scss'

export const DailyLoginRewardsScreen = () => {
  const { data } = useGetDailyRewards()
  const { data: isRewardCollected } = useIsDailyLoginRewardCollected()
  const { isOpen, closePopup } = usePopup()
  const [showConfetti, setShowConfetti] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const closeHandler = () => {
    closePopup()
    setShowConfetti(false)
  }

  const { mutate: collectReward, isLoading: isCollecting } = useCollectReward()

  const collectRewardHandler = () => {
    if (!isRewardCollected) collectReward(undefined, { onSuccess: () => setShowConfetti(true) })
  }

  return (
    <Drawer
      anchor="right"
      classes={{ root: css.root, paper: css.paper }}
      open={isOpen('daily-login-rewards')}
      onClose={closeHandler}
    >
      <div className={css.wrapper} ref={wrapperRef}>
        {showConfetti && (
          <Confetti
            width={wrapperRef.current?.clientWidth}
            height={wrapperRef.current?.clientHeight}
            numberOfPieces={1000}
            recycle={false}
            tweenDuration={1000 * 1}
            gravity={0.2}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        )}
        <span className={css.close_button}>
          <IconButton aria-label="close" onClick={closeHandler}>
            <XIcon />
          </IconButton>
        </span>
        <span className={css.info_button}>
          <IconButton aria-label="info" onClick={() => setShowInfo(true)}>
            <InfoIcon />
          </IconButton>
        </span>
        <h3>Daily Login Rewards</h3>
        <ul>
          {!data?.collectionList?.length ||
            data.collectionList.map(({ isCollected, day }) => {
              if (day > data.today) return <li key={day} />

              if (!isCollected && day === data.today) return <li key={day} />

              return (
                <li key={`$collected-${day}`} className={(isCollected && css.collected) || css.not_collected}>
                  {(isCollected && <CheckIcon />) || <XIcon />}
                </li>
              )
            })}
        </ul>
        <div>
          <ButtonBase
            className={`${css.button} ${!isRewardCollected || css.collected}`}
            onClick={collectRewardHandler}
            disableRipple={isRewardCollected}
          >
            <RewardIcon />
            <ConditionalRender condition={!isRewardCollected}>
              <span>
                Tap to collect <br />
                today&apos;s reward
              </span>
              <span>
                {(data?.baseReward ?? 0) * (data?.collectionList.filter(c => c.isCollected).length ?? 1)} U-coins
                Collected
              </span>
            </ConditionalRender>
          </ButtonBase>
        </div>
        {!isRewardCollected || (
          <div className={css.hint}>
            <span>Collections can be seen in transaction section in coin wallet</span>
          </div>
        )}
        <div className={css.timer}>
          <span>Collect your next reward in</span>
          {isOpen('daily-login-rewards') && (
            <CountDown
              showDeadLine={!isRewardCollected}
              endTime={moment(data?.date)
                .add(1 + (data?.today ?? 0), 'd')
                .toDate()}
            />
          )}
        </div>
        <div
          className={`${css.info_wrapper} ${showInfo && css.show_info}`}
          role="button"
          onClick={() => setShowInfo(false)}
        >
          <div>
            <p>{data?.info}</p>
          </div>
          <span>Click anywhere to close</span>
        </div>
        <div className={`${css.loader} ${isCollecting && css.show}`}>
          <span>Collecting reward...</span>
        </div>
      </div>
    </Drawer>
  )
}
