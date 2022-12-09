import http from '../../config/http'

export type ReportType_ = 'post' | 'user'

type FetchPostCriteria_ = {
  data: {
    _id: string
    criteria: string
  }[]
}
type ReportParams_ = {
  criteriaId: string
  type: ReportType_
  id: string
}

const url = {
  report: {
    post: (postId: string) => `/user/report/post/${postId}`,
    user: (userId: string) => `/user/report/user/${userId}`
  },
  criteria: '/user/report/criterias'
}

const fetchReportCriteria = () => http.get<FetchPostCriteria_>(url.criteria)

const report = ({ criteriaId, type, id }: ReportParams_) =>
  http.post(url.report[type](id), { criteriaId })

const reportRouters = { fetchCriteria: fetchReportCriteria, report }

export default reportRouters
