import { Skeleton } from '@mui/material'
import Link from 'next/link'

import useGetTransactions from '../../api-routes/transactions/get-transactions'
import { BalanceInfo } from '../../components/ui/balance-info'
import Loader from '../../components/ui/loader'
import TransactionCard from '../../components/ui/transaction-card'
import TransactionSummary from '../../components/ui/transaction-summary'
import WalletCard from '../../components/ui/wallet-card'
import CoinStatsPreview from '../../features/coin-wallet/components/coin-stats-preview'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/wallet-page.module.scss'

const TransactionList = (): JSX.Element => {
  const { data, isLoading, isFetching } = useGetTransactions()

  return (
    <div>
      <div className={css.transaction_header}>
        <h6 className={css.title}>
          Recent Transaction{' '}
          {(isFetching || isLoading) && (
            <span className={css.loader}>
              <Loader />
            </span>
          )}
        </h6>
        <Link href="/wallet/transactions">See all</Link>
      </div>
      <div className={css.transactions}>
        {isLoading || !data
          ? Array.from(Array(3).keys()).map(_in => (
              <Skeleton
                key={`loader-${_in}`}
                variant="rectangular"
                animation="wave"
                width="100%"
                height="104px"
                style={{ borderRadius: 10 }}
              />
            ))
          : data.pages[0]
              .slice(0, 3)
              .map(transactionLine => <TransactionCard key={transactionLine._id} {...transactionLine} />)}
      </div>
      <div className={css.transaction_footer}>
        <Link href="/wallet/transactions">View more</Link>
      </div>
    </div>
  )
}

const CoinWalletPage = () => {
  usePageTitle({ title: 'Wallet' })

  return (
    <div className={css.wrapper}>
      <BalanceInfo />
      <WalletCard />
      <TransactionSummary />
      <TransactionList />
      <CoinStatsPreview />
    </div>
  )
}

CoinWalletPage.Layout = HomeLayout

export default CoinWalletPage
