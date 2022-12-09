import AddPostIcon from '../../../../components/icons/add-post.icon'
import LikeIcon from '../../../../components/icons/like.icon'
import MoreCircleIcon from '../../../../components/icons/more-circle.icon'
import RewardIcon from '../../../../components/icons/reward.icon'
import ValuationPostIcon from '../../../../components/icons/valuationPostIcon'
import useIncomeStats from '../../../../hooks/coin-stats/income-stats.hook'
import Graph from '../graph'

const IncomeStats = () => {
  const { data, isLoading, isFetching, refetch } = useIncomeStats()

  return (
    <div>
      <Graph
        isFetching={isLoading || isFetching}
        onRefresh={refetch}
        headline="Income"
        data={[
          { label: 'Rewards', value: data?.REWARDS ?? 0, icon: <RewardIcon /> },
          { label: 'Valuation', value: data?.VALUATION ?? 0, icon: <ValuationPostIcon /> },
          { label: 'Post Uploads', value: data?.UPLOADS ?? 0, icon: <AddPostIcon /> },
          { label: 'Likes & Interests', value: data?.LIKES ?? 0, icon: <LikeIcon /> },
          { label: 'Others', value: data?.OTHERS ?? 0, icon: <MoreCircleIcon /> }
        ]}
        initialChart="doughnut"
      />
    </div>
  )
}

export default IncomeStats
