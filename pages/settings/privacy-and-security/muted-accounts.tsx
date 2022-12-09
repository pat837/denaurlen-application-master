import MutedAccountsScreen from '../../../components/screens/blocked-muted-users/muted-accounts.screen'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'

const MutedAccountsPage = () => {
  usePageTitle({ title: 'Muted Accounts' })

  return <MutedAccountsScreen />
}

MutedAccountsPage.Layout = HomeLayout

export default MutedAccountsPage
