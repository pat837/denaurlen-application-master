import { ThemeProvider } from '@mui/material'
import { useRouter } from 'next/router'
import { FC, ReactNode, useContext, useEffect, useState } from 'react'
import { QueryClientProvider } from 'react-query'

import userService from '../../api-routes/user'
import WithAuth from '../../auth/with-auth'
import WithoutAuth from '../../auth/without-auth'
import { queryClient } from '../../config/query-client'
import { AuthContext } from '../../contexts/auth.context'
import ProfileContextProvider from '../../contexts/profile.context'
import { ThemeContext } from '../../contexts/theme.context'
import SplashScreen from '../splash-screen'
import Button from './button'
import Head from './head-section'
import Popup from './popup'
import ToastMessage from './toast-message'

import type { AppProps } from '../../types'

const EmptyProperty = ({ children }: { children: ReactNode | FC }) => <>{children}</>

export const Root = ({ Component, pageProps, ...rest }: AppProps) => {
  const [isLoading, setIsLoading] = useState(true)

  const { setUser } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const router = useRouter()

  const removeLoader = () => setTimeout(() => setIsLoading(false), 2000)

  const [Layout, Auth] = [Component.Layout || EmptyProperty, Component.isInSecure ? WithoutAuth : WithAuth]

  useEffect(() => {
    userService
      .isLoggedIn()
      .then(({ data }) => {
        if (data.isLogin) {
          setUser(data.user)
        }
        removeLoader()
      })
      .catch(() => {
        removeLoader()
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production')
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          registration.pushManager.getSubscription()
          Notification?.requestPermission()
        })
        .catch(() => {})
  }, [])

  if (isLoading) return <SplashScreen />

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ProfileContextProvider>
          <Auth>
            <Layout>
              <Head />
              <Component {...rest} {...pageProps} />
              <Popup open={typeof navigator !== 'undefined' && !navigator.onLine} onClose={() => null}>
                <div className="offline-popup">
                  <div>
                    <h5>You are offline</h5>
                    <p>Its seems there is a problem with connection. Please check your network status</p>
                    <Button label="Try again" onClick={router.reload} />
                  </div>
                </div>
              </Popup>
            </Layout>
          </Auth>
          <ToastMessage />
        </ProfileContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
