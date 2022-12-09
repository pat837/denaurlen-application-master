import { Accordion, AccordionDetails, AccordionSummary, ButtonBase, Switch } from '@mui/material'
import router from 'next/router'
import { useState } from 'react'

import useToastMessage from '../../../hooks/toast-message.hook'
import CheckCircleIcon from '../../icons/check-circle.icon'
import ChevronDownIcon from '../../icons/chevron-down.icon'
import MinusCircleIcon from '../../icons/minus-circle.icon'
import MuteIcon from '../../icons/mute.icon'
import PageIcon from '../../icons/page.icon'
import SlashIcon from '../../icons/slash.icon'
import css from './../../../styles/pages/settings/setting.page.module.scss'

const PrivacyAndSecurityScreen = () => {
  const showToast = useToastMessage()

  const handle = {
    blockAccount: () => router.push('/settings/privacy-and-security/blocked-users'),
    mutedAccounts: () => router.push('/settings/privacy-and-security/muted-accounts'),
    comingSoon: () => {
      showToast('This feature will enabled in future updates')
      if ('vibrate' in navigator) navigator?.vibrate(100)
    }
  }

  return (
    <div className={css.page}>
      <div className={css.wrapper}>
        <ul>
          <li>
            <ul>
              <li>
                <ButtonBase className={css.list_item} disableRipple>
                  <CheckCircleIcon />
                  <span>Active Status</span>
                  <div>
                    <Switch checked inputProps={{ 'aria-label': 'active-account' }} color="default" />
                  </div>
                </ButtonBase>
              </li>
              <li>
                <div className={css.list_item}>
                  <p className={css.note}>
                    Allow accounts you follow and anyone you message to see when you were active
                  </p>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <ButtonBase className={css.list_item} onClick={handle.blockAccount}>
                  <SlashIcon />
                  <span>Blocked Accounts</span>
                </ButtonBase>
              </li>
              <li>
                <ButtonBase className={css.list_item} onClick={handle.mutedAccounts}>
                  <MuteIcon />
                  <span>Muted Accounts</span>
                </ButtonBase>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <ReadPoliciesButton />
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li>
                <ButtonBase className={`${css.list_item} ${css.danger}`} onClick={handle.comingSoon}>
                  <MinusCircleIcon />
                  <span>Deactivate My Account</span>
                </ButtonBase>
              </li>
              {/* <li>
                <ButtonBase className={`${css.list_item} ${css.danger}`} onClick={handle.comingSoon}>
                  <DeleteIcon />
                  <span>Delete My Account</span>
                </ButtonBase>
              </li> */}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

const ReadPoliciesButton = () => {
  const [open, setOpen] = useState(false)
  const toggleAccordion = () => setOpen(!open)

  return (
    <Accordion expanded={open} className={css.accordion} onChange={toggleAccordion}>
      <AccordionSummary
        className={css.summary}
        expandIcon={<ChevronDownIcon />}
        aria-controls="read-policies-content"
        id="read-policies-header"
      >
        <div className={css.list_item}>
          <PageIcon />
          <span>Read our Policies</span>
        </div>
      </AccordionSummary>
      <AccordionDetails className={css.details}>
        <ul className={css.links_list}>
          <li>
            <ButtonBase
              target="_blank"
              href="https://www.denaurlen.in/legal/privacy-policy"
              rel="noreferrer"
            >
              Privacy Policy
            </ButtonBase>
          </li>
          <li>
            <ButtonBase target="_blank" href="https://www.denaurlen.in/legal/cookies" rel="noreferrer">
              Cookies Policy
            </ButtonBase>
          </li>
          <li>
            <ButtonBase
              target="_blank"
              href="https://www.denaurlen.in/legal/terms-conditions"
              rel="noreferrer"
            >
              Terms &amp; Conditions
            </ButtonBase>
          </li>
          <li>
            <ButtonBase target="_blank" href="https://www.denaurlen.in/legal/community" rel="noreferrer">
              Community Guidelines
            </ButtonBase>
          </li>
          <li>
            <ButtonBase
              target="_blank"
              href="https://www.denaurlen.in/legal/social-media"
              rel="noreferrer"
            >
              Social Media Guidelines
            </ButtonBase>
          </li>
        </ul>
      </AccordionDetails>
    </Accordion>
  )
}

export default PrivacyAndSecurityScreen
