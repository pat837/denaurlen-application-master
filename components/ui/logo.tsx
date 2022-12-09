import { useRouter } from 'next/router'

import css from '../../styles/ui.module.scss'

const Logo = () => {
  const router = useRouter()

  const clickHandler = () => router.push('/profile')

  return (
    <span onClick={clickHandler} className={css.logo}>
      dena<span className={css.u}>u</span>rlen<sup>BETA</sup>
    </span>
  )
}

export default Logo
