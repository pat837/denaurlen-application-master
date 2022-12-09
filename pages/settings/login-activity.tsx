import { ButtonBase } from '@mui/material'
import moment from 'moment'
import router from 'next/router'
import { useState } from 'react'

import useFetchLoginDevices from '../../api-routes/settings/get-login-devices'
import useRemoveDevice from '../../api-routes/settings/remove-device'
import { LoginDevice_ } from '../../api-routes/settings/settings.routes'
import MonitorIcon from '../../components/icons/monitor.icon'
import SmartphoneIcon from '../../components/icons/smartphone.icon'
import TabletIcon from '../../components/icons/tablet.icon'
import Button from '../../components/ui/button'
import LogoutPopup from '../../components/ui/logout.popup'
import Popup from '../../components/ui/popup'
import useFetchNextPage from '../../hooks/fetch-next-page.hook'
import usePageTitle from '../../hooks/page-title.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/settings/login-activity.module.scss'

const icon = {
  smartphone: <SmartphoneIcon />,
  tablet: <TabletIcon />,
  desktop: <MonitorIcon />
} as const

const CurrentDevice = ({ device }: { device?: LoginDevice_ }) => {
  if (device === undefined) return <></>

  const handleLogout = () => {
    router.push({ pathname: router.pathname, query: { popup: 'logout' } }, undefined, {
      shallow: true
    })
  }

  return (
    <>
      <h5>current device</h5>
      <div className={css.wrapper}>
        <ButtonBase key={device._id} className={css.card_wrapper} onClick={handleLogout}>
          <div className={css.card}>
            {icon[device.deviceType]}
            <div className={css.info}>
              <span className={css.name}>
                {!device.deviceBrand && !device.deviceModel
                  ? `${device.osName} ${device.deviceType}`
                  : `${device.deviceBrand} ${device.deviceModel}`}
              </span>
              <time>{moment(device.createdAt).format('[at] hh:mm a, MMM DD, yyyy')}</time>
            </div>
          </div>
        </ButtonBase>
      </div>
      <LogoutPopup />
    </>
  )
}

const LoginActivityPage = () => {
  usePageTitle({ title: 'Login Activity' })

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useFetchLoginDevices(20)
  const showToast = useToastMessage()

  const [{ selectDevice }, setState] = useState<{
    selectDevice: LoginDevice_ | null
  }>({
    selectDevice: null
  })

  const clickHandler = (device: LoginDevice_) => () => {
    setState(state => ({
      ...state,
      selectDevice: device
    }))
  }

  const nextPageTrigger = useFetchNextPage({
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false,
    fetchNextPage
  })

  const closeHandler = () => setState(s => ({ ...s, selectDevice: null }))

  const { mutate, isLoading } = useRemoveDevice({
    onError: error => {
      showToast(error?.response?.data?.message || 'Unable to logout, try later')
    },
    onSuccess: closeHandler
  })

  const removeDevice = () => {
    if (selectDevice?._id) mutate({ deviceId: selectDevice._id })
  }

  return (
    <div className={css.page}>
      <div className={css.page_container}>
        <div className={css.page_wrapper}>
          <CurrentDevice device={data?.pages?.[0]?.currentDevice} />
          <h5>login devices(s)</h5>
          <div className={css.wrapper}>
            {data?.pages.map((page, pageNo) => {
              const isLastPage = data.pages.length === pageNo + 1

              return page.otherDevices.map((device, index) => (
                <ButtonBase
                  key={device._id}
                  className={css.card_wrapper}
                  ref={isLastPage && index === 5 ? nextPageTrigger : undefined}
                  onClick={clickHandler(device)}
                >
                  <div className={css.card}>
                    {icon[device.deviceType]}
                    <div className={css.info}>
                      <span className={css.name}>
                        {!device.deviceBrand && !device.deviceModel
                          ? `${device.osName} ${device.deviceType}`
                          : `${device.deviceBrand} ${device.deviceModel}`}
                      </span>
                      <time>{moment(device.createdAt).format('[at] hh:mm a, MMM DD, yyyy')}</time>
                    </div>
                  </div>
                </ButtonBase>
              ))
            })}
          </div>
        </div>
      </div>
      <Popup open={selectDevice !== null} onClose={closeHandler}>
        <div className={css.popup}>
          {selectDevice === null || (
            <div className={css.popup_wrapper}>
              {icon[selectDevice.deviceType]}
              <span>
                {!selectDevice.deviceBrand && !selectDevice.deviceModel
                  ? `${selectDevice.osName} ${selectDevice.deviceType}`
                  : `${selectDevice.deviceBrand} ${selectDevice.deviceModel}`}
              </span>
              <p>Are you want to logout from this device?</p>
              <div>
                <Button label="cancel" variant="contained" onClick={closeHandler} />
                <Button label="logout" color="danger" loading={isLoading} onClick={removeDevice} />
              </div>
            </div>
          )}
        </div>
      </Popup>
    </div>
  )
}

LoginActivityPage.Layout = HomeLayout

export default LoginActivityPage
