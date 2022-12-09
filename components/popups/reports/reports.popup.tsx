import { ButtonBase } from '@mui/material'
import router from 'next/router'
import { useState } from 'react'

import useFetchPostCriteria from '../../../api-routes/reports/fetch-post-criteria'
import useReport from '../../../api-routes/reports/report'
import { ReportType_ } from '../../../api-routes/reports/reports.routes'
import usePopup from '../../../hooks/popup.hook'
import Button from '../../ui/button'
import ConditionalRender from '../../ui/conditional-render'
import Popup from '../../ui/popup'
import css from './report.popup.module.scss'

const ReportsPopup = () => {
  const { isOpen, closePopup } = usePopup()
  const { data, isLoading } = useFetchPostCriteria()
  const [criteriaId, setCriteriaId] = useState('')

  const onClick = (criteriaId: string) => () => setCriteriaId(criteriaId)

  const closeHandler = () => {
    closePopup()
    setCriteriaId('')
  }

  const { mutate: report, isLoading: isReporting } = useReport({ onSuccess: closeHandler })

  const reportHandler = () =>
    report({
      criteriaId,
      type: router.query?.type as ReportType_,
      id: router.query.id as string
    })

  return (
    <Popup open={isOpen('report')} onClose={closeHandler}>
      <div className={css.popup}>
        <h4>Report</h4>
        <ConditionalRender condition={!criteriaId}>
          <ConditionalRender condition={isLoading}>
            <span>Loading...</span>
            <div>
              <h6>Why are you reporting this {router.query?.type}</h6>
              <ul className={css.list}>
                {data?.map(({ _id, criteria }) => (
                  <li key={_id}>
                    <ButtonBase onClick={onClick(_id)}>{criteria}</ButtonBase>
                  </li>
                ))}
              </ul>
            </div>
          </ConditionalRender>
          <div className={css.confirmation}>
            <p>
              we&apos;ll look into this {router.query?.type}, if we find anything suspicious we&apos;ll
              take necessary actions.
            </p>
            <Button label="report" color="danger" loading={isReporting} onClick={reportHandler} />
            <Button label="cancel" variant="text" onClick={closeHandler} />
          </div>
        </ConditionalRender>
      </div>
    </Popup>
  )
}

export default ReportsPopup
