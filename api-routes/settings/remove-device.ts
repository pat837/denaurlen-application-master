import { AxiosResponse } from 'axios'
import { InfiniteData, useMutation } from 'react-query'

import { queryClient } from '../../config/query-client'
import { ErrorCallback_, SuccessCallback_ } from '../../types'
import { fetchLoginDevicesKey } from './get-login-devices'
import settingsRoutes, { GetLoginDevices_ } from './settings.routes'

type Data_ = InfiniteData<AxiosResponse<GetLoginDevices_, any>>
type UseRemoveDeviceParams_ = {
  onSuccess: SuccessCallback_
  onError: ErrorCallback_
}

const useRemoveDevice = ({ onSuccess, onError }: UseRemoveDeviceParams_) => {
  return useMutation(settingsRoutes.login.removeDevice, {
    onSuccess(_data, variables, _context) {
      const queryData = queryClient.getQueryData<Data_>(fetchLoginDevicesKey)

      if (queryData !== undefined) {
        queryClient.setQueryData<Data_>(fetchLoginDevicesKey, {
          ...queryData,
          pages: queryData.pages.map(page => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.otherDevices.filter(device => device._id !== variables.deviceId)
            }
          }))
        })
      }
      onSuccess()
    },
    onError(error, _variables, _context) {
      onError(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries(fetchLoginDevicesKey)
    }
  })
}

export default useRemoveDevice
