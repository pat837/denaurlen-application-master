import { ButtonBase, Drawer, IconButton } from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'
import { useContext, useState } from 'react'

import { ProfileContext } from '../../../contexts/profile.context'
import useCopyToClipboard from '../../../hooks/copy-to-clipboard.hook'
import usePopup from '../../../hooks/popup.hook'
import useShareOption from '../../../hooks/share.hook'
import CopyIcon from '../../icons/copy.icon'
import XIcon from '../../icons/x.icon'
import Button from '../../ui/button'
import css from './referral-code.module.scss'
import ReferralList from './referral-list'

const ReferralCodeScreen = () => {
  const { isOpen, closePopup } = usePopup()
  const { profile } = useContext(ProfileContext)
  const share = useShareOption()
  const copyToClipboard = useCopyToClipboard()

  const [link] = useState(`https://www.denaurlen.com/signup?referral=${profile.referralCode}`)

  const copyHandler = () =>
    copyToClipboard({
      copyText: profile.referralCode,
      message: 'Referral code is copied to your clipboard'
    })

  const shareHandler = () =>
    share({
      title: 'DENAURLEN | Know yourself first',
      text: `Hey 👋🏼, \nYour friend, ${profile.name} is using Denaurlen application. Try it now`,
      url: link
    })

  return (
    <Drawer
      anchor="right"
      classes={{ root: css.root }}
      open={isOpen('referral-code')}
      onClose={closePopup}
    >
      <div className={css.wrapper}>
        <div className={css.close_button}>
          <IconButton aria-label="close" onClick={closePopup}>
            <XIcon />
          </IconButton>
        </div>
        <div className={css.container}>
          <h3>Referral Code</h3>
          <div className={css.qrcode_wrapper}>
            <QRCodeSVG className={css.qrcode} value={link} />
          </div>
          <ButtonBase className={css.code} onClick={copyHandler}>
            <code>{profile.referralCode}</code>
            <CopyIcon />
          </ButtonBase>
          <Button label="share referral link" variant="outline" onClick={shareHandler} />
        </div>
        {isOpen('referral-code') && <ReferralList />}
      </div>
    </Drawer>
  )
}

export { ReferralCodeScreen }
