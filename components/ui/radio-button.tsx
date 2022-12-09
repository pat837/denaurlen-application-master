import { ComponentProps } from 'react'

import css from '../../styles/ui.module.scss'

type RadioButtonProps = {
  label: string
} & ComponentProps<'input'>

const RadioButton = ({ label, id, ...rest }: RadioButtonProps) => {
  const _id = id || Date.now() + '-' + label

  return (
    <div className={css.radio_wrapper}>
      <input type="radio" {...rest} id={_id} />
      <label htmlFor={_id}>{label}</label>
    </div>
  )
}

export default RadioButton
