import { Skeleton } from '@mui/material'
import { ComponentProps, useEffect, useState } from 'react'
import { getMediaURL } from '../../../utils/get-url'

type CategoryIconProps_ = { src: string; categoryId: string } & ComponentProps<'span'>

const CategoryIcon = ({ src, categoryId, ...rest }: CategoryIconProps_) => {
  const [{ icon, isLoading }, setState] = useState({
    icon: '',
    isLoading: true
  })

  useEffect(() => {
    const iconLS = localStorage.getItem(categoryId)
    const iconSS = sessionStorage.getItem(categoryId)

    if (iconLS !== null) setState({ isLoading: false, icon: iconLS })

    if (iconSS === null) {
      fetch(getMediaURL(src), {})
        .then(res => res.text())
        .then(icon => {
          setState({ icon, isLoading: false })
          localStorage.setItem(categoryId, icon)
          sessionStorage.setItem(categoryId, icon)
        })
        .catch(() => {
          setState({ icon: '', isLoading: false })
        })
    }
  }, [categoryId, icon, src])

  if (isLoading) return <Skeleton className={rest.className} variant="circular" />

  return <span {...rest} dangerouslySetInnerHTML={{ __html: icon }} />
}

export default CategoryIcon
