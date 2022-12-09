import useGetTodaysTransactionsSummary from '../../api-routes/transactions/get-todays-summary'
import { numberFormat } from '../../utils'
import css from '../../styles/components/ui/transaction-summary.module.scss'
import DownArrow from '../icons/down-arrow'
import UpArrow from '../icons/up-arrow'
import Loader from './loader'
import TextWithLoader from './text-with-loader'

const getText = (number: number | undefined, isShort = false) =>
  number !== undefined ? `${numberFormat(number, isShort)}` : ''

const TransactionSummary = () => {
  const { data, isFetching, isLoading } = useGetTodaysTransactionsSummary()

  return (
    <div className={css.wrapper}>
      <div className={css.title}>
        <h4>Today</h4>
        {isFetching && <Loader />}
      </div>
      <div className={css.body}>
        <div>
          <UpArrow />
          <p>
            <TextWithLoader
              loading={isLoading}
              text={data?.credited === 0 ? 0 : getText(data?.credited)}
            />
          </p>
        </div>
        <div>
          <DownArrow />
          <p>
            <TextWithLoader loading={isLoading} text={getText(data?.debited)} />
          </p>
        </div>
      </div>
    </div>
  )
}

export default TransactionSummary
