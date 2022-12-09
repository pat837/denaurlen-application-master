import { ReactNode } from 'react'

type ConditionalRenderProps = {
  condition: boolean
  children: ReactNode[]
}

const ConditionalRender = ({ condition, children }: ConditionalRenderProps) => {
  if (condition) return <>{children[0]}</>

  return <>{children[1]}</>
}

export default ConditionalRender
