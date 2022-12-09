import { Badge, IconButton } from '@mui/material'

import useIsDailyLoginRewardCollected from '../../api-routes/rewards/is-collected'
import usePopup from '../../hooks/popup.hook'
import RewardIcon from '../icons/reward.icon'

const DailyLoginRewardIcon = ({ onClick }: { onClick?: () => void }) => {
  const { openPopup } = usePopup()
  const { data, isLoading } = useIsDailyLoginRewardCollected()

  const clickHandler = () => {
    openPopup('daily-login-rewards')
    if (onClick) onClick()
  }

  return (
    <IconButton aria-label="daily-login-reward" onClick={clickHandler}>
      <Badge
        color="error"
        badgeContent={isLoading || data === undefined ? 0 : data ? 0 : 1}
        variant="dot"
      >
        <RewardIcon />
      </Badge>
    </IconButton>
  )
}

export default DailyLoginRewardIcon
