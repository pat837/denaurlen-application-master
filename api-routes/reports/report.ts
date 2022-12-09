import { useMutation } from 'react-query'

import useToastMessage from '../../hooks/toast-message.hook'
import reportRouters from './reports.routes'

import type { MutationSuccessCallback_ } from '../../types'

type UseReportParams_ = {
  onSuccess: MutationSuccessCallback_
}

const useReport = ({ onSuccess }: UseReportParams_) => {
  const toast = useToastMessage()

  return useMutation(reportRouters.report, {
    onSuccess(data, _variables, _context) {
      toast(data?.data?.message || 'Report as been submitted')
      onSuccess(data)
    },
    onError(error: any, _variables, _context) {
      toast(error?.response?.data?.message || 'Something went wrong, try later')
    }
  })
}

export default useReport
