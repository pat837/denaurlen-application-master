import css from '../../styles/components/ui/passcode-popup.module.scss'
import Popup from './popup'
import Text from './typography'

type PasscodePopupProps_ = {
  open: boolean
  onValidPin: () => void
}

const PasscodePopup = ({ open, onValidPin }: PasscodePopupProps_) => {
  return (
    <Popup open={open} onClose={() => null}>
      <div className={css.wrapper}>
        <Text type="headline1">Enter U-Card pin</Text>
        <Text type="body1">Your U-Card pin is required to unlock the screen</Text>
        <form onSubmit={e => {}}>
          <input type="number" className={css.pin} placeholder="P A S S C O D E" autoFocus />
        </form>
        <p className={css.otp_resend}>
          Forgot U-Card pin?{' '}
          <a
            href="!#"
            style={{ fontWeight: 600 }}
            onClick={e => {
              e.preventDefault()
            }}
          >
            click here
          </a>
        </p>
      </div>
    </Popup>
  )
}

export default PasscodePopup
