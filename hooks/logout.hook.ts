import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

import userService from '../api-routes/user'
import { queryClient } from '../config/query-client'
import storage from '../config/storage'
import { sleep } from '../utils'
import { AuthContext } from '../contexts/auth.context'
import { ThemeContext } from '../contexts/theme.context'

const useLogout = () => {
  const [router, { removeUser }, { setTheme }, [isLoading, setLoader]] = [
    useRouter(),
    useContext(AuthContext),
    useContext(ThemeContext),
    useState(false)
  ]

  const handleLogout = () => {
    setLoader(true)
    userService
      .logout()
      .then(() => {
        queryClient.clear()
        removeUser()
        router.push('/login')
        sleep(1000, () => {
          storage.session.clear()
          storage.local.clear()
        })
        setTheme('LIGHT')
      })
      .catch(() => {
        setLoader(false)
        alert('Logout failed')
      })
  }

  return { handleLogout, isLoggingOut: isLoading }
}

export default useLogout
