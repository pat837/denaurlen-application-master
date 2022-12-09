import { useInfiniteQuery } from 'react-query'

import { getNextPageParams } from '../../utils'
import settingsRoutes from './settings.routes'

export const fetchLoginDevicesKey = 'login-devices'

const useFetchLoginDevices = (size = 20) =>
  useInfiniteQuery(
    fetchLoginDevicesKey,
    ({ pageParam = 1 }) => settingsRoutes.login.getLoginDevice({ size, page: pageParam }),
    {
      select: response => ({
        pageParams: response.pageParams,
        pages: response.pages.map(page => ({
          currentDevice: page.data.currentDevice,
          otherDevices: page.data.otherDevices
        }))
      }),
      getNextPageParam: lastPage => getNextPageParams(lastPage.data.currentPage, lastPage.data.pages)
    }
  )

export default useFetchLoginDevices
