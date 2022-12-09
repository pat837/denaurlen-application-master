import { createContext, ReactNode, useState } from 'react'

import { queryClient } from '../config/query-client'

import type { userType } from '../types'

type AuthContextType = {
  user: userType
  setUser: (user: userType) => void
  removeUser: () => void
}

const USER: userType = {
  username: '',
  email: '',
  name: '',
  categories: 10
}

const AuthContext = createContext<AuthContextType>({
  user: USER,
  setUser: (user: userType) => {},
  removeUser: () => {}
})

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const user_ = {
    username: '',
    email: '',
    name: '',
    categories: 10
  }

  const [user, setState] = useState<userType>(user_)

  const setUser = (user: userType) => {
    setState({ ...user })
  }

  const removeUser = () => {
    queryClient.clear()
    localStorage.clear()
    sessionStorage.clear()
    setState(user_)
  }

  return <AuthContext.Provider value={{ user, setUser, removeUser }}>{children}</AuthContext.Provider>
}

export { AuthContext }
export default AuthContextProvider
