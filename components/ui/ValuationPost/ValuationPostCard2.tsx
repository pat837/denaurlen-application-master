import { useTimer } from 'react-timer-hook'

import css from '../../../styles/components/ui/valuation/post-card.module.scss'
import { addLeadZero } from '../../../utils'

export const CountDown = ({ endTime, showDeadLine = true }: { endTime: Date; showDeadLine?: boolean }) => {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: endTime
  })

  const className = `${css.post_count_down} ${showDeadLine && hours + days * 24 === 0 && css.dead_line} ${
    minutes === 0 && seconds === 0 && hours + days * 24 === 0 && css.completed
  }`

  return (
    <p className={className}>
      <code>{addLeadZero(hours + days * 24)}</code>:<code>{addLeadZero(minutes)}</code>:
      <code>{addLeadZero(seconds)}</code>
    </p>
  )
}
