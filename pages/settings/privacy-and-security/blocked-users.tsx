import BlockedUsersScreen from '../../../components/screens/blocked-muted-users/blocked-users.screen'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'

const BlockedUsersPage = () => {
  usePageTitle({ title: 'Blocked Accounts' })

  return <BlockedUsersScreen />
}

BlockedUsersPage.Layout = HomeLayout

export default BlockedUsersPage
