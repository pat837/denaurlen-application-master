import PrivacyAndSecurityScreen from '../../../components/screens/privacy-and-security-screen'
import usePageTitle from '../../../hooks/page-title.hook'
import HomeLayout from '../../../layouts/home.layout'

const PrivacyAndSecurity = () => {
  usePageTitle({ title: 'Privacy & Security' })

  return <PrivacyAndSecurityScreen />
}

PrivacyAndSecurity.Layout = HomeLayout

export default PrivacyAndSecurity
