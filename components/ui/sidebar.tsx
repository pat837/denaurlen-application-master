import { Badge, IconButton, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { useRouter } from 'next/router'
import { title } from 'process'
import { ReactNode } from 'react'
import { useDispatch } from 'react-redux'

import useGetReferralCount from '../../api-routes/settings/get-referral-count'
import { navbarActions } from '../../data/actions'
import useToastMessage from '../../hooks/toast-message.hook'
import css from '../../styles/sidebar.module.scss'
import AddPostIcon from '../icons/add-post.icon'
import BenchmarksIcon from '../icons/benchmark.icon'
import CompassIcon from '../icons/compass.icon'
import HomeIcon from '../icons/home.icon'
import LeaderboardIcon from '../icons/leaderboard.icon'
import SettingsIcon from '../icons/settings.icon'
import StatsboardsIcon from '../icons/statsboards.icon'
import AddOption from './add-option'
import { ValuationCriteriaPopup } from './bottom-add-option.popup'
import SearchPopup from './search-popup'

type NavIconButtonProps = {
  title: string
  onClick: () => void
  children: ReactNode
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    background: 'var(--accent-color)',
    borderRadius: 10.5,
    maxWidth: 220,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    textTransform: 'capitalize',
    color: '#FFFFFF'
  }
}))

const NavIconButton = ({ title, onClick, children }: NavIconButtonProps) => {
  return (
    <HtmlTooltip title={<>{title}</>} placement="right">
      <IconButton size="large" onClick={onClick}>
        {children}
      </IconButton>
    </HtmlTooltip>
  )
}

const Sidebar = () => {
  const [navigate, dispatch, showToast] = [useRouter().push, useDispatch(), useToastMessage()]

  const { data: count } = useGetReferralCount()

  const settingIcon =
    (count ?? 10) === 10 ? (
      <SettingsIcon />
    ) : (
      <Badge color="error" badgeContent={count} variant="dot">
        <SettingsIcon />
      </Badge>
    )

  const navLinks = [
    { title: 'Home', icon: <HomeIcon />, onClick: () => navigate('/home') },
    {
      title: 'Explore',
      icon: <CompassIcon />,
      onClick: () => navigate('/explore')
    },
    {
      title: 'Add Post',
      icon: <AddPostIcon />,
      onClick: () => dispatch(navbarActions.openAddOption())
    },
    {
      title: 'Leaderboard',
      icon: <LeaderboardIcon />,
      onClick: () => navigate('/leaderboard')
    },
    {
      title: 'Benchmarks',
      icon: <BenchmarksIcon />,
      // onClick: () => navigate('/benchmarks')
      onClick: () => showToast('This feature will enabled in future updates')
    },
    {
      title: 'Statsboard',
      icon: <StatsboardsIcon />,
      onClick: () => navigate('/statsboard')
    },
    {
      title: 'Settings',
      icon: settingIcon,
      onClick: () => navigate('/settings')
    }
  ]

  return (
    <div className={css.container}>
      <nav title="Main Navigation" className={css.wrapper}>
        {navLinks.map((navLink, indx) => (
          <NavIconButton key={`${title}-${indx}`} onClick={navLink.onClick} title={navLink.title}>
            {navLink.icon}
          </NavIconButton>
        ))}
      </nav>
      <AddOption />
      <SearchPopup />
      <ValuationCriteriaPopup />
    </div>
  )
}

export default Sidebar
