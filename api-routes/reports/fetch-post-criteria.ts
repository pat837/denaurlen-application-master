import { useQuery } from 'react-query'

import reportRouters from './reports.routes'

const postCriteriaKey = 'post-criteria'

const useFetchPostCriteria = () =>
  useQuery(postCriteriaKey, reportRouters.fetchCriteria, {
    select: response => response.data.data
  })

export default useFetchPostCriteria
