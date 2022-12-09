import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FC, ReactNode, useContext, useLayoutEffect } from 'react';

import SplashScreen from '../components/splash-screen';
import { AuthContext } from '../contexts/auth.context';

type WithoutAuthProps = {
  children: ReactNode | FC | NextPage
}

const WithoutAuth = ({ children }: WithoutAuthProps) => {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  useLayoutEffect(() => {
    if (!!user.username && !!user.email && !!user.name) router.replace('/profile')
  }, [router, user])

  if (!user.username || !user.email || !user.name) return <>{children}</>

  return <SplashScreen />
}

export default WithoutAuth
