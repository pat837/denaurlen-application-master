import { ButtonBase, Skeleton } from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ChangeEvent, FormEvent, useContext, useState } from 'react'

import useFetchCardDetails from '../../api-routes/transactions/fetch-card-details'
import useGenerateCard from '../../api-routes/transactions/generate-card'
import transactionQueries from '../../api-routes/transactions/transactions.routes'
import CardLogo from '../../assets/card-logo'
import { ProfileContext } from '../../contexts/profile.context'
import usePopup from '../../hooks/popup.hook'
import useToastMessage from '../../hooks/toast-message.hook'
import css from '../../styles/components/ui/wallet-card.module.scss'
import { walletCardNoFormatter } from '../../utils'
import PlusIcon from '../icons/plus.icon'
import KnowYourPin from '../popups/know-your-pin.popup'
import ResetPinPopup from '../popups/reset-pin.popup'
import UpdatePinPopup from '../popups/update-pin.popup'
import Button from './button'
import Popup from './popup'

const cardCSS = {
  SILVER: css.silver,
  GOLD: css.gold,
  PLATINUM: css.platinum
}

export const getCardCSS = (limit: number) => (limit === 10000 ? cardCSS.SILVER : cardCSS.GOLD)

const WalletCard = () => {
  const { profile } = useContext(ProfileContext)
  const router = useRouter()
  const showToast = useToastMessage()
  const { openPopup: popupHandler } = usePopup()

  const { data, isLoading } = useFetchCardDetails()

  const [{ openPopup, otp, openConfirmPopup }, setState] = useState({
    openPopup: false,
    openConfirmPopup: false,
    otp: ''
  })

  const { mutate: VerifyCodeAndGenerate, isLoading: isSubmitting } = useGenerateCard()

  const otpChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setState(state => ({ ...state, otp: e.target.value as string }))
  }

  const generateHandler = () => {
    transactionQueries.sendCardRequest().catch(() => {
      setState(state => ({ ...state, openPopup: false }))
      showToast('Unable to generate card, please try later')
    })
    setState(state => ({ ...state, openPopup: true }))
  }

  const closeHandler = () => setState(state => ({ ...state, openPopup: false, otp: '' }))

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!otp.trim()) return undefined

    VerifyCodeAndGenerate(
      { otp: otp.trim() },
      {
        onSuccess: () => {
          showToast('Your DENAURLEN Card is generated')
          setState(state => ({ ...state, openPopup: false, otp: '' }))
        },
        onError: (error: any, _variables, _context) => {
          showToast(error?.response?.data?.message || 'Unable to generate card, try later')
          setState(state => ({ ...state, otp: '' }))
        }
      }
    )
  }
  const showMessage = useToastMessage()
  const shareHandler = () => showMessage('This feature will enabled in future updates')
  const handleConfirm = () => showMessage('This feature will enabled in future updates')

  // const shareHandler = () => router.push('/wallet/u-card')
  // const handleConfirm = () => setState(state => ({ ...state, openConfirmPopup: true }))

  const onHaveOTP = () => setState(state => ({ ...state, openPopup: true, openConfirmPopup: false }))

  const closeConfirmPopup = () => setState(state => ({ ...state, openConfirmPopup: false }))

  if (isLoading)
    return (
      <div className={css.wrapper}>
        <Skeleton variant="rectangular" width="100%" height="auto" animation="wave" className={css.card_loader} />
      </div>
    )

  if (data?.isCardGenerated === false)
    return (
      <>
        <div className={css.wrapper}>
          <ButtonBase className={css.generate_button} onClick={handleConfirm}>
            <PlusIcon />
            <span>Tap to generate U-Card</span>
          </ButtonBase>
        </div>
        <Popup open={openConfirmPopup} onClose={closeConfirmPopup}>
          <div className={css.popup}>
            <h3>You need confirmation code to generate card</h3>
            <div className={css.btn_grp}>
              <Button label="have code" variant="outline" onClick={onHaveOTP} />
              <Button label="get code" onClick={generateHandler} />
            </div>
          </div>
        </Popup>
        <Popup open={openPopup} onClose={closeHandler}>
          <div className={css.popup}>
            <form onSubmit={submitHandler} className={css.popup_wrapper}>
              <h3>Confirmation Code</h3>
              <p>
                We have send confirmation code to your registered email (<span>{profile.email}</span>)
              </p>
              <input
                className={css.otp}
                type="number"
                value={otp}
                placeholder="Confirmation Code"
                onChange={otpChangeHandler}
              />
              <Button label="generate card" type="submit" loading={isSubmitting} />
              <p className={css.otp_resend}>
                Didn&apos;t receive code?{' '}
                <a
                  href="!#"
                  style={{ fontWeight: 600 }}
                  onClick={e => {
                    e.preventDefault()
                    generateHandler()
                  }}
                >
                  Resend
                </a>
              </p>
            </form>
          </div>
        </Popup>
      </>
    )

  return (
    <div className={css.card_wrapper}>
      <div className={css.wrapper}>
        <div className={`${css.card} ${getCardCSS(data?.limit || 10000)}`}>
          <span className={css.blur} />
          <div className={css.card_details}>
            <div className={css.logo}>
              <CardLogo />
            </div>
            <div className={css.user}>
              <p>{profile.name}</p>
              <span>{walletCardNoFormatter(`${data?.card_number}`)}</span>
              <time>
                <span>Exp date </span>
                {moment(data?.expiry_date).format('MM / YY')}
              </time>
            </div>
          </div>
        </div>
      </div>
      <div className={css.actions}>
        <Button label="share coins" onClick={shareHandler} />
        <Button variant="contained" label="know your pin" onClick={() => popupHandler('know-your-pin')} />
        <Button variant="contained" label="update pin" onClick={() => popupHandler('update-pin')} />
        <Button variant="contained" label="reset pin" onClick={() => popupHandler('reset-pin')} />
      </div>
      <KnowYourPin />
      <UpdatePinPopup />
      <ResetPinPopup />
    </div>
  )
}

export default WalletCard
