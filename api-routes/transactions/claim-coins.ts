import { AxiosResponse } from 'axios'
import { InfiniteData, useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import { blockedCoinsKey } from './fetch-blocked-coins'
import { claimCoinsKey } from './fetch-claimed-coins'
import queries from './transactions.routes'

import type { FetchBlockedCoins_ } from '../../types/transactions.types'
type BlockData_ = InfiniteData<AxiosResponse<FetchBlockedCoins_, any>>

const useClaimCoins = () =>
  useMutation(queries.claimCoins, {
    onSuccess: (_data, variables, _context) => {
      const queryData = queryClient.getQueryData<BlockData_>(blockedCoinsKey)

      queryClient.invalidateQueries(claimCoinsKey)

      if (!queryData) return undefined

      queryClient.setQueryData<BlockData_>(blockedCoinsKey, {
        ...queryData,
        pages: queryData.pages.map(page => ({
          ...page,
          data: {
            ...page.data,
            data: page.data.data.filter(i => i._id !== variables.trackId)
          }
        }))
      })
      queryClient.invalidateQueries(blockedCoinsKey)
    }
  })

export default useClaimCoins
