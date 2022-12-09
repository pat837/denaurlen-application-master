import { ChangeEventHandler } from 'react'

import CheckIcon from '../../icons/check.icon'
import css from './checkbox.module.scss'

type CheckboxProps_ = {
  checked: boolean
  label: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

const Checkbox = ({ checked, label, onChange }: CheckboxProps_) => {
  const id = `${Math.random()}-${label}`

  return (
    <div className={css.wrapper}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <label htmlFor={id}>
        <span className={css.checkbox}>
          <CheckIcon />
        </span>
        <span className={css.label}>{label}</span>
      </label>
    </div>
  )
}

export { Checkbox }
