import { ButtonBase, ButtonBaseProps } from '@mui/material'
import { ReactNode } from 'react'

import css from './button.module.scss'

type ButtonProps_ = {
  variant?: 'filled' | 'contained' | 'outline' | 'text' | 'blur'
  label: string | ReactNode
  loading?: boolean
  color?: 'default' | 'primary' | 'danger'
  removePadding?: boolean
  square?: boolean
} & ButtonBaseProps

const Button = ({
  variant = 'filled',
  label,
  loading = false,
  color = 'primary',
  className = '',
  removePadding = false,
  square = false,
  disableRipple,
  ...rest
}: ButtonProps_) => {
  const styles = `${css.wrapper} ${css[variant]} ${css[color]} ${loading ? css.loading : ''} ${
    removePadding ? css.no_padding : ''
  } ${square && css.square} ${className}`

  return (
    <ButtonBase className={styles} disableRipple={loading || disableRipple} {...rest}>
      <span className={css.label}>{label}</span>
      <div className={css.loader_wrapper}>
        <svg className={css.spinner} viewBox="0 0 50 50">
          <circle className={css.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
        </svg>
      </div>
    </ButtonBase>
  )
}

export { Button }
