import Head from 'next/head'

import WelcomeIllustration from '../assets/welcome-illustration'
import ForgotPasswordForm from '../components/forms/forget-password'
import css from '../styles/pages/auth.page.module.scss'

const ForgotPasswordPage = () => (
  <>
    <Head>
      <title>Forgot Password | Denaurlen</title>
    </Head>
    <div className={css.wrapper}>
      <div className={css.illustration_wrapper}>
        <div className={css.illustrator_container}>
          <WelcomeIllustration />
        </div>
      </div>
      <div className={css.form_container}>
        <ForgotPasswordForm />
      </div>
    </div>
  </>
)

ForgotPasswordPage.isInSecure = true

export default ForgotPasswordPage
