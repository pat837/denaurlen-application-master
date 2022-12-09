import { useQuery } from 'react-query'
import valuationPostQueries from '.'

const isValuationUnlockedKey = 'is-valuation-unlocked'

const useIsValuationUnlock = () =>
  useQuery(isValuationUnlockedKey, valuationPostQueries.isValuationUnlocked, {
    select: response => {
      if (response.data?.data === true)
        return {
          data: true,
          followings: true,
          followers: true,
          top10Posts: true,
          generalPosts: true,
          counts: {
            followings: 10,
            followers: 10,
            top10Posts: 10,
            generalPosts: 10
          }
        }
      return { ...response.data, data: false }
    },
    staleTime: 1000 * 60 * 3 // 👉 FIVE MINUTES
  })

export default useIsValuationUnlock
