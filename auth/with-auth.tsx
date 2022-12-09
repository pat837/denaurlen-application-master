import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FC, ReactNode, useContext, useLayoutEffect } from 'react';

import SplashScreen from '../components/splash-screen';
import constants from '../config/constants'
import { AuthContext } from '../contexts/auth.context'

type WithAuthProps = {
  children: ReactNode | FC | NextPage
}

const SET_CATEGORY_URL = '/set-categories'

const WithAuth = ({ children }: WithAuthProps) => {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  useLayoutEffect(() => {
    if (!user.username || !user.email || !user.name) {
      window.sessionStorage.setItem(constants.initRoute, router.asPath)
      router.replace('/login')
    } else if (router.asPath === SET_CATEGORY_URL && user.categories === 10) router.replace('/profile')
    else if (router.asPath !== SET_CATEGORY_URL && user.categories !== 10) router.replace(SET_CATEGORY_URL)
  }, [router, user])

  if (!!user.name && !!user.username && !!user.email) return <>{children}</>

  return <SplashScreen />
}

export default WithAuth
