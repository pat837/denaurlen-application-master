import { ButtonBase } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'

import { useGetBalance } from '../../api-routes/Profile'
import useGetTodaysTransactionsSummary from '../../api-routes/transactions/get-todays-summary'
import { ProfileContext } from '../../contexts/profile.context'
import useInViewport from '../../hooks/in-viewport.hook'
import balanceInfoCSS from '../../styles/components/ui/balance-info.module.scss'
import css from '../../styles/ui.module.scss'
import { numberFormat as format } from '../../utils'
import CodeIcon from '../icons/code.icon'
import CoinsIcon2 from '../icons/coins2.icon'
import DownArrow from '../icons/down-arrow'
import UpArrow from '../icons/up-arrow'
import Button from './button'
import ConditionalRender from './conditional-render'
import Text from './text-with-loader'

const getText = (number: number | undefined, isShort: boolean) =>
  number !== undefined ? `${format(number, isShort)}` : ''

export const BalanceButton = () => {
  const { profile } = useContext(ProfileContext)
  const [{ data, isLoading }, router] = [useGetBalance(profile.username, true), useRouter()]

  const clickHandler = useCallback(() => router.push('/wallet'), [router])

  return (
    <ButtonBase aria-label="balance" className={css.coin_button} onClick={clickHandler}>
      <CoinsIcon2 />
      <span>
        <Text loading={isLoading} text={getText(data?.balance, (data?.balance || 0) > 9999)} length={3} />
      </span>
    </ButtonBase>
  )
}

export const BalanceCount = () => {
  const { profile } = useContext(ProfileContext)
  const { data, isLoading } = useGetBalance(profile.username, true)

  return (
    <p className={css.total_balance}>
      <CoinsIcon2 className={css.coins} />
      <span>
        <Text loading={isLoading} text={getText(data?.balance, false)} length={5} />
      </span>
    </p>
  )
}

export const BalanceInfo = () => {
  const { profile } = useContext(ProfileContext)
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const { data, isLoading } = useGetBalance(profile.username, isVisible)
  const { data: transactions } = useGetTodaysTransactionsSummary()

  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  return (
    <div className={balanceInfoCSS.wrapper}>
      <span>Balance</span>
      <h3>
        <Text loading={isLoading} text={getText(data?.balance, false)} length={6} />
        {transactions === undefined || (
          <ConditionalRender condition={transactions.credited === transactions.debited}>
            <span style={{ transform: 'rotate(90deg)', scale: '0.85' }}>
              <CodeIcon />
            </span>
            <span style={{ transform: 'rotate(-51deg)' }}>
              <ConditionalRender condition={transactions.credited > transactions.debited}>
                <UpArrow />
                <DownArrow />
              </ConditionalRender>
            </span>
          </ConditionalRender>
        )}
      </h3>
      {!data?.blockedCoins || (
        <p>
          <p>
            Blocked&nbsp;{' '}
            <span>{<Text loading={isLoading} text={getText(data?.blockedCoins, false)} length={5} />}</span>
            &nbsp;&nbsp;{' '}
            <Button
              label="claim"
              variant="text"
              onClick={() => {
                router.push('/wallet/blocked-coins')
              }}
              removePadding
            />
          </p>
        </p>
      )}
    </div>
  )
}

export const OthersBalanceCount = ({ username }: { username: string }) => {
  const { ref, isVisible } = useInViewport({})
  const { data, isLoading } = useGetBalance(username, isVisible)

  return (
    <p className={css.total_balance}>
      <CoinsIcon2 className={css.coins} />
      <span ref={ref}>
        <Text loading={isLoading} text={getText(data?.balance, false)} length={6} />
      </span>
    </p>
  )
}
