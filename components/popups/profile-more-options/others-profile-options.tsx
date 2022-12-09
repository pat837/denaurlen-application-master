import { ButtonBase } from '@mui/material'
import router from 'next/router'
import { useState } from 'react'

import useBlockUser from '../../../api-routes/privacy/block-user'
import useMuteUser from '../../../api-routes/privacy/mute-user'
import useCopyToClipboard from '../../../hooks/copy-to-clipboard.hook'
import useOpenReportPopup from '../../../hooks/open-report-popup.hook'
import usePopup from '../../../hooks/popup.hook'
import useShareOption from '../../../hooks/share.hook'
import LinkIcon from '../../icons/link.icon'
import ReportIcon from '../../icons/report.icon'
import ShareIcon from '../../icons/share.icon'
import Button from '../../ui/button'
import ConditionalRender from '../../ui/conditional-render'
import Popup from '../../ui/popup'
import css from './profile-options.module.scss'

const OthersProfileOptions = () => {
  const [{ openConfirmPopup, type }, setState] = useState<{
    openConfirmPopup: boolean
    type: 'mute' | 'block'
  }>({
    openConfirmPopup: false,
    type: 'mute'
  })
  const { closePopup, isOpen } = usePopup()
  const copyToClipboard = useCopyToClipboard()
  const shareOption = useShareOption()

  const handleCopy = () => {
    copyToClipboard({
      copyText: `${window.location.origin}/${router.query?.username}`,
      message: 'Copied link to clipboard'
    })
    closePopup()
  }
  const handleShare = () => {
    shareOption({
      url: `${window.location.origin}/${router.query?.username}`
    })
    closePopup()
  }
  const { mutate: blockUser, isLoading: isBlocking } = useBlockUser({
    callback: { success: _r => {}, error: _e => {} }
  })
  const { mutate: muteUser, isLoading: isMuting } = useMuteUser({
    callback: { success: _r => {}, error: _e => {} }
  })
  const handleReport = useOpenReportPopup({ type: 'user', id: (router?.query?.userId as string) || '' })

  const closeConfirmPopup = () => setState(state => ({ ...state, openConfirmPopup: false }))
  const openConfirmBlock = () => setState(state => ({ ...state, openConfirmPopup: true, type: 'block' }))
  const openConfirmMute = () => setState(state => ({ ...state, openConfirmPopup: true, type: 'mute' }))

  const handleBlockAndMute = () => {
    const userId = (router?.query?.userId as string) || ''

    if (type === 'block') return blockUser({ userId })
    muteUser({ userId })
  }

  return (
    <>
      <Popup open={isOpen('profile-options')} onClose={closePopup}>
        <div className={css.popup}>
          <div className={css.wrapper}>
            <ButtonBase onClick={handleShare}>
              <ShareIcon />
              <span>Share</span>
            </ButtonBase>
            <ButtonBase onClick={handleCopy}>
              <LinkIcon />
              <span>Link</span>
            </ButtonBase>
            <ButtonBase className={css.danger} onClick={handleReport}>
              <ReportIcon />
              <span>Report</span>
            </ButtonBase>
            <ButtonBase onClick={openConfirmMute}>
              <span>Mute profile</span>
            </ButtonBase>
            <ButtonBase onClick={openConfirmBlock}>
              <span>Block profile</span>
            </ButtonBase>
          </div>
        </div>
      </Popup>
      <Popup open={openConfirmPopup} onClose={closeConfirmPopup}>
        <div className={css.confirm_popup}>
          <div className={css.container}>
            <h4>
              <span>{type}</span>&nbsp;@{router?.query?.username as string}?
            </h4>
            <ConditionalRender condition={type === 'block'}>
              <p>
                They will not be able to follow you or view any of your posts, and you will not see any activity of
                them.
              </p>
              <p>Are you sure you want to mute this profile?</p>
            </ConditionalRender>
            <Button label={type} color="danger" loading={isBlocking || isMuting} onClick={handleBlockAndMute} />
            <Button label="cancel" variant="text" onClick={closeConfirmPopup} />
          </div>
        </div>
      </Popup>
    </>
  )
}

export default OthersProfileOptions
