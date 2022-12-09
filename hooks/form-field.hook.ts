import { ChangeEvent, useCallback, useState } from 'react'

type useFormFieldProps = {
  initialValue?: any
  regex?: RegExp | null
  required?: boolean
  name?: string
  regExMessage?: string
  onlyLowercase?: boolean
  length?: number
}
type errorStateType = {
  error: boolean
  helperText: string
}

const useFormField = ({
  initialValue = '',
  regex = null,
  required = false,
  name = 'field',
  regExMessage,
  onlyLowercase = false,
  length
}: useFormFieldProps) => {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<errorStateType>({
    error: false,
    helperText: ''
  })

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement> | ChangeEvent<{ value: unknown }> | any) => {
      const val = event.target.value as string
      setValue((onlyLowercase && val.toLowerCase()) || val)
      if (required && !val)
        setError({
          error: true,
          helperText: `${name === 'field' ? 'This field is required' : `Please enter your ${name}`}`
        })
      else if (!!regex && !regex.test(val))
        setError({ error: true, helperText: regExMessage || `Invalid ${name}` })
      else if (typeof length === 'number' && val.length > length)
        setError({ error: true, helperText: `${name} should contain upto ${length} characters` })
      else setError({ error: false, helperText: '' })
    },
    [name, onlyLowercase, regExMessage, regex, required, length]
  )

  const reset = () => setValue('')

  return {
    params: {
      ...error,
      value,
      onChange
    },
    value,
    reset,
    setError,
    setValue
  }
}

export default useFormField
