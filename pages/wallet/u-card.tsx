import moment from 'moment'
import { useContext, useState } from 'react'

import useFetchCardDetails from '../../api-routes/transactions/fetch-card-details'
import useGetTodaysLimit from '../../api-routes/transactions/fetch-todays-limit'
import useGetShareCoinsTransaction from '../../api-routes/transactions/get-share-coins-transaction'
import TransferIcon from '../../components/icons/transfer.icon'
import { BalanceInfo } from '../../components/ui/balance-info'
import Button from '../../components/ui/button'
import ConditionalRender from '../../components/ui/conditional-render'
import PasscodePopup from '../../components/ui/passcode.popup'
import Text from '../../components/ui/typography'
import { ProfileContext } from '../../contexts/profile.context'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import usePageTitle from '../../hooks/page-title.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import HomeLayout from '../../layouts/home.layout'
import transactionCSS from '../../styles/components/ui/transaction-card.module.scss'
import css from '../../styles/pages/u-card.page.module.scss'
import { ifElse, numberFormat } from '../../utils'

const TreasuryPage = () => {
  usePageTitle({ title: 'Wallet' })
  const showToast = useToastMessage()

  const [{ isLocked }] = useState({
    isLocked: false
  })
  const { profile } = useContext(ProfileContext)
  const { data } = useFetchCardDetails()
  const { data: limit } = useGetTodaysLimit()
  const {
    data: transactions,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetShareCoinsTransaction(30)

  // const gotoShareCoins = () => router.push('/wallet/share-coins')
  const gotoShareCoins = () => showToast('This feature will enabled in future updates')

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    isLoading: isFetchingNextPage
  })

  return (
    <div className={css.wrapper}>
      <BalanceInfo />
      <div className={css.card}>
        <div className={css.limit_wrapper}>
          <Text type="headline2" _as="code">
            {numberFormat(limit || 0)}
            <Text type="body1" _as="span">
              {' '}
              / {numberFormat(data?.limit || 0)}
            </Text>
          </Text>
          <Text type="body3" _as="span">
            Current Limit
          </Text>
        </div>
        <div className={css.share_wrapper}>
          <Button label="share" className={css.share} onClick={gotoShareCoins} />
        </div>
      </div>
      <div>
        <Text type="title2" _as="h5" className={css.title}>
          Recent transactions
        </Text>
        <ConditionalRender condition={isLoading}>
          <div></div>
          <div>
            {transactions?.pages.map((page, pageNo) => {
              const isLastPage = transactions.pages.length === pageNo + 1

              return page.map(({ _id, cr_Account, dr_Account, amount, createdAt }, index) => {
                const isDebited = dr_Account._id === profile._id

                return (
                  <div
                    key={`${index}-${_id}`}
                    className={transactionCSS.card}
                    ref={(isLastPage && index === 20 && nextPageTrigger) || undefined}
                  >
                    <div className={transactionCSS.icon}>
                      <TransferIcon />
                    </div>
                    <div className={transactionCSS.info}>
                      <div className={transactionCSS.account}>
                        <ConditionalRender condition={isDebited}>
                          <span>
                            <span>to</span> {cr_Account.username}
                          </span>
                          <span>
                            <span>from</span> {dr_Account.username}
                          </span>
                        </ConditionalRender>
                      </div>
                      <time>{moment(createdAt).format('[at] hh:mm a, MMM D yyyy')}</time>
                    </div>
                    <code>
                      <span className={ifElse(isDebited, transactionCSS.debit, undefined)}>
                        {ifElse(isDebited, '-', '+')}
                      </span>
                      {numberFormat(amount)}
                    </code>
                  </div>
                )
              })
            })}
          </div>
        </ConditionalRender>
      </div>
      <PasscodePopup open={isLocked} onValidPin={() => {}} />
    </div>
  )
}

TreasuryPage.Layout = HomeLayout

export default TreasuryPage
