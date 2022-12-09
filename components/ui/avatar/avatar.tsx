import css from './avatar.module.scss'

import { Avatar as MuiAvatar } from '@mui/material'
import { getMediaURL } from '../../../utils/get-url'

type AvatarProps_ = {
  url?: string
  isAbsoluteURL?: boolean
  className?: string
  alt: string
}

const Avatar = ({ url, isAbsoluteURL, className, alt }: AvatarProps_) => {
  const props = !url
    ? { src: undefined, alt: undefined }
    : { src: (isAbsoluteURL && url) || getMediaURL(url), alt }

  return (
    <MuiAvatar {...props} className={`${css.avatar} ${className || ''}`} imgProps={{ loading: 'lazy' }} />
  )
}

export { Avatar }
