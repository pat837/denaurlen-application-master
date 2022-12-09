import Button from '../../ui/button'
import css from './error-screen.module.scss'

export const ErrorScreen = () => (
  <div className={css.wrapper}>
    <h1>Oops</h1>
    <p>Something went wrong</p>

    <div>
      <Button label="give feedback" />
      <Button label="go back" variant="outline" />
    </div>

    <section>
      <h4>Why I&apos;m seeing this?</h4>
      <p>
        This release is in preview. Features are noted as beta, pilot, or developer preview. This Beta
        Version does not represent the final stable version. Some features might not work, as application
        is still in development
      </p>
      <span>
        For any feedbacks or suggestion you can navigate to feedbacks section in application settings.
      </span>
    </section>
  </div>
)
