import css from './welcome-illustration.module.scss'

import WelcomeMobile from '../welcome-mobile'

const WelcomeIllustration = () => {
  return (
    <div className={css.wrapper}>
      <div className={css.title}>
        <h1>
          DENAURLEN<sup>BETA</sup>
        </h1>
        <p>Know Yourself First!</p>
      </div>
      <WelcomeMobile />
      <span style={{ height: '3.5vh' }} />
    </div>
  )
}

export { WelcomeIllustration }
