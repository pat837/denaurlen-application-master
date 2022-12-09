import { useContext } from 'react'

import useGetAllCategories from '../api-routes/categories/get-all-categories'
import SetCategories from '../components/screens/set-categories'
import SplashScreen from '../components/splash-screen'
import { AuthContext } from '../contexts/auth.context'

const SetCategoriesPage = () => {
  const { user } = useContext(AuthContext)

  const { data, isLoading } = useGetAllCategories()

  if (user.categories === 10 || isLoading) return <SplashScreen />

  return <SetCategories user={user} categories={data || []} />
}

export default SetCategoriesPage
