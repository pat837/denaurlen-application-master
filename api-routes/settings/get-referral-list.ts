import { useQuery } from 'react-query'

import routes from './settings.routes'

export const referralListKey = 'referral-list'

const useGetReferralList = () =>
  useQuery(referralListKey, routes.referral.list, {
    select: response => response.data.data
  })

export default useGetReferralList
