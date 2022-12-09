import { useQuery } from 'react-query'

import routes from './settings.routes'

export const referralCountKey = 'referral-count'

const useGetReferralCount = () =>
  useQuery(referralCountKey, routes.referral.count, {
    select: response => response.data.data
  })

export default useGetReferralCount
