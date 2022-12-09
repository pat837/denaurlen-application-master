import { FC } from 'react'

import css from '../../styles/ui.module.scss'

const Loader: FC = () => {
  return (
    <svg className={css.spinner} viewBox="0 0 50 50">
      <circle className={css.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
  )
}

export default Loader
