import { ReportType_ } from '../api-routes/reports/reports.routes'
import usePopup from './popup.hook'

type UseOpenReportPopupParams_ = {
  type: ReportType_
  id: string
}

const useOpenReportPopup = (params: UseOpenReportPopupParams_) => {
  const { openPopup } = usePopup()
  return () => openPopup('report', { params })
}

export default useOpenReportPopup
