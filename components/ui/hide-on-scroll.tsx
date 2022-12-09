import { Slide, useScrollTrigger } from '@mui/material'
import { ReactElement } from 'react'

type HideOnScrollProps = {
  window?: () => Window
  children: ReactElement
  direction?: 'up' | 'left' | 'right' | 'down'
}

const HideOnScroll = ({ children, window, direction }: HideOnScrollProps) => {
  const trigger = useScrollTrigger({ target: window ? window() : undefined })

  return (
    <Slide appear={false} direction={direction || 'down'} in={!trigger}>
      {children}
    </Slide>
  )
}

export const AutoDisplay = ({ children }: { children: ReactElement }) => (
  <Slide appear={true} direction={'up'} in={true}>
    {children}
  </Slide>
)
export default HideOnScroll
