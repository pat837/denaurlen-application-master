import Head from 'next/head'

import WelcomeIllustration from '../assets/welcome-illustration'
import LoginForm from '../components/forms/login'
import css from '../styles/pages/auth.page.module.scss'

const LoginPage = () => (
  <>
    <Head>
      <title>Login | Denaurlen</title>
    </Head>
    <div className={css.wrapper}>
      <div className={css.illustration_wrapper}>
        <div className={css.illustrator_container}>
          <WelcomeIllustration />
        </div>
      </div>
      <div className={css.form_container}>
        <LoginForm />
      </div>
    </div>
  </>
)

LoginPage.isInSecure = true

export default LoginPage
