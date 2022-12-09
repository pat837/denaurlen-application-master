import DeleteIcon from '../../../../components/icons/delete.icon'
import LikeIcon from '../../../../components/icons/like.icon'
import MoreCircleIcon from '../../../../components/icons/more-circle.icon'
import ValuationPostIcon from '../../../../components/icons/valuationPostIcon'
import useOutgoingStats from '../../../../hooks/coin-stats/outgoing-stats.hook'
import Graph from '../graph'

const OutgoingStats = () => {
  const { data, isLoading, isFetching, refetch } = useOutgoingStats()

  return (
    <div>
      <Graph
        isFetching={isLoading || isFetching}
        onRefresh={refetch}
        headline="Outgoing"
        data={[
          { label: 'Post deletion', value: data?.UPLOADS ?? 0, icon: <DeleteIcon /> },
          { label: 'Likes & Interests', value: data?.LIKES ?? 0, icon: <LikeIcon /> },
          { label: 'Valuation', value: data?.VALUATION ?? 0, icon: <ValuationPostIcon /> },
          { label: 'Others', value: data?.OTHERS ?? 0, icon: <MoreCircleIcon /> }
        ]}
        initialChart="bar"
      />
    </div>
  )
}

export default OutgoingStats
