import { ButtonBase, Switch } from '@mui/material'
import { useRouter } from 'next/router'
import { ChangeEvent, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useGetReferralCount from '../../api-routes/settings/get-referral-count'
import ChangeProfilePic from '../../components/forms/change-profile-pic'
import EditProfileForm from '../../components/forms/edit-profile'
import ChevronRightIcon from '../../components/icons/chevron-right.icon'
import EditIcon2 from '../../components/icons/edit2.icon'
import InfoRoundIcon from '../../components/icons/info.icon'
import LayoutIcon from '../../components/icons/layout.icon'
import LoaderIcon from '../../components/icons/loader.icon'
import LockIcon from '../../components/icons/lock.icon'
import LogoutIcon from '../../components/icons/logout.icon'
import MoonIcon from '../../components/icons/moon.icon'
import NotificationIcon from '../../components/icons/notification.icon'
import PageIcon from '../../components/icons/page.icon'
import PasswordIcon from '../../components/icons/password.icon'
import ReferralCodeIcon from '../../components/icons/referral-code.icon'
import ShieldDoneIcon from '../../components/icons/shield-done.icon'
import ReferralCodeScreen from '../../components/screens/referral-code-screen'
import LogoutPopup from '../../components/ui/logout.popup'
import { ProfileContext } from '../../contexts/profile.context'
import { ThemeContext } from '../../contexts/theme.context'
import { profilePageActions, systemOptionsActions } from '../../data/actions'
import usePageTitle from '../../hooks/page-title.hook'
import usePopup from '../../hooks/popup.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import HomeLayout from '../../layouts/home.layout'
import css from '../../styles/pages/settings/setting.page.module.scss'
import { ifElse } from '../../utils'

import type { storeType } from '../../types'

const SettingsHomePage = () => {
  const [
    router,
    dispatch,
    { mode, setTheme },
    { profile, refetchProfile: refetch },
    {
      profilePage: { editProfile },
      systemOptions: { zenMode, ambientBio }
    },
    { openPopup },
    showToast
  ] = [
    useRouter(),
    useDispatch(),
    useContext(ThemeContext),
    useContext(ProfileContext),
    useSelector((store: storeType) => store),
    usePopup(),
    useToastMessage()
  ]

  usePageTitle({ title: 'Settings' })

  const [checked, setChecked] = useState(mode === 'DARK')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    setTheme(event.target.checked ? 'DARK' : 'LIGHT')
  }
  const ambientBioToggler = () => dispatch(systemOptionsActions.layoutSettings.toggleAmbientBio())

  const { data: count } = useGetReferralCount()

  const handle = {
    appInfo: () => router.push('settings/app-info'),
    changePassword: () => router.push('/settings/change-password'),
    setPassword: () => router.push('/settings/set-password'),
    loginActivity: () => router.push('/settings/login-activity'),
    logout: () => {
      router.push({ pathname: router.pathname, query: { popup: 'logout' } }, undefined, {
        shallow: true
      })
    },
    comingSoon: () => {
      showToast('This feature will enabled in future updates')
      if ('vibrate' in navigator) navigator?.vibrate(100)
    },
    referralCode: () => openPopup('referral-code'),
    feedback: () => window.open('https://forms.gle/jKztePZuT8AKELDb8', '_blank'),
    privacyAndSecurity: () => router.push('/settings/privacy-and-security')
  }

  const openEditProfile = () => {
    dispatch(
      profilePageActions.openEditProfile({
        country: profile.country,
        dateOfBirth: profile.dateOfBirth,
        email: profile.email,
        gender: profile.gender,
        location: {
          type: 'Point',
          coordinates: profile.location.coordinates
        },
        name: profile.name,
        username: profile.username,
        place: profile.place,
        profilePic: profile.profilePic,
        countryCode: profile.countryCode
      })
    )
  }

  return (
    <div className={css.page}>
      <div className={css.wrapper}>
        <ButtonBase className={css.beta_note} onClick={handle.appInfo}>
          <InfoRoundIcon />
          <p>This is Beta Version of the Denaurlen application</p>
        </ButtonBase>
        <ul>
          <li>
            <ul>
              {zenMode.isActive && (
                <li>
                  <ButtonBase className={css.list_item} onClick={handle.comingSoon}>
                    <LayoutIcon />
                    <span>Layout Preferences</span>
                    <ChevronRightIcon />
                  </ButtonBase>
                </li>
              )}
              <li>
                <ButtonBase disableRipple className={css.list_item} style={{ paddingBottom: 0 }}>
                  <LoaderIcon />
                  <span>Ambient Bio in profile</span>
                  <div>
                    <Switch
                      checked={ambientBio}
                      onChange={ambientBioToggler}
                      inputProps={{ 'aria-label': 'ambient-bio-mode-toggle' }}
                      color="primary"
                    />
                  </div>
                </ButtonBase>
              </li>
              <li>
                <ButtonBase disableRipple className={css.list_item}>
                  <MoonIcon />
                  <span>Dark Mode</span>
                  <div>
                    <Switch
                      checked={checked}
                      onChange={handleChange}
                      inputProps={{ 'aria-label': 'dark-mode-toggle' }}
                      color="primary"
                    />
                  </div>
                </ButtonBase>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <ButtonBase className={css.list_item} onClick={openEditProfile}>
                  <EditIcon2 />
                  <span>Edit Profile</span>
                </ButtonBase>
              </li>
              <li>
                <ButtonBase
                  className={css.list_item}
                  onClick={handle[profile.authType === 'gmail' ? 'setPassword' : 'changePassword']}
                >
                  <PasswordIcon />
                  <span>{ifElse(profile.authType === 'gmail', 'Set', 'Change')} Password</span>
                </ButtonBase>
              </li>
              <li>
                <ButtonBase className={css.list_item} onClick={handle.comingSoon}>
                  <NotificationIcon />
                  <span>Notifications</span>
                  <ChevronRightIcon />
                </ButtonBase>
              </li>
              <li>
                <ButtonBase className={css.list_item} onClick={handle.referralCode}>
                  <ReferralCodeIcon />
                  <span>Referral Code</span>
                  {(count ?? 10) === 10 || (
                    <div className={css.referral_count}>
                      <span>{10 - (count ?? 10)}</span>
                    </div>
                  )}
                </ButtonBase>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <ButtonBase className={css.list_item} onClick={handle.privacyAndSecurity}>
                  <ShieldDoneIcon />
                  <span>Privacy &amp; Security</span>
                  <ChevronRightIcon />
                </ButtonBase>
              </li>
              <li>
                <ButtonBase className={css.list_item} onClick={handle.feedback}>
                  <PageIcon />
                  <span>Give Feedback</span>
                </ButtonBase>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <ButtonBase className={css.list_item} onClick={handle.appInfo}>
                  <InfoRoundIcon />
                  <span>App Info</span>
                </ButtonBase>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <ButtonBase className={css.list_item} onClick={handle.loginActivity}>
                  <LockIcon />
                  <span>Login Activity</span>
                  <ChevronRightIcon />
                </ButtonBase>
              </li>
              <li>
                <ButtonBase className={`${css.list_item} ${css.danger}`} onClick={handle.logout}>
                  <LogoutIcon />
                  <span>Logout</span>
                </ButtonBase>
              </li>
            </ul>
          </li>
        </ul>
        {!!editProfile.username && <EditProfileForm refetch={refetch} />}
        {!!editProfile.username && <ChangeProfilePic refetch={refetch} />}
        <LogoutPopup />
        <ReferralCodeScreen />
      </div>
    </div>
  )
}

SettingsHomePage.Layout = HomeLayout

export default SettingsHomePage
