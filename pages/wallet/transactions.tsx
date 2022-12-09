import { Skeleton } from '@mui/material'
import { useDispatch } from 'react-redux'

import useGetTransactions from '../../api-routes/transactions/get-transactions'
import Button from '../../components/ui/button'
import TransactionCard from '../../components/ui/transaction-card'
import usePageTitle from '../../hooks/page-title.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/wallet-page.module.scss'

const TransactionsPage = () => {
  const [{ data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage }, dispatch] = [
    useGetTransactions(),
    useDispatch()
  ]

  usePageTitle({ title: 'Transactions' })

  const loadBtnHandler = () => {
    if (hasNextPage) fetchNextPage()
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={css.transactions_page}>
      <div className={css.transactions}>
        {isLoading || !data
          ? Array.from(Array(5).keys()).map(_in => (
              <Skeleton
                key={`loader-${_in}`}
                variant="rectangular"
                animation="wave"
                width="100%"
                height="104px"
                style={{ borderRadius: 10 }}
              />
            ))
          : data.pages.map(page => page.map(line => <TransactionCard key={line._id} {...line} />))}
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <Button
            label={hasNextPage ? 'load more' : 'scroll to top'}
            variant="text"
            loading={isFetchingNextPage}
            onClick={loadBtnHandler}
          />
        </div>
      </div>
    </div>
  )
}

TransactionsPage.Layout = HomeLayout

export default TransactionsPage
