import { ComponentProps, ElementType, ReactNode } from 'react'

import css from './../../styles/components/ui/typography.module.scss'

type textType<E extends ElementType> = {
  children: ReactNode
  type?:
    | 'display1'
    | 'display2'
    | 'display3'
    | 'headline1'
    | 'headline2'
    | 'headline3'
    | 'title1'
    | 'title2'
    | 'title3'
    | 'label1'
    | 'label2'
    | 'label3'
    | 'body1'
    | 'body2'
    | 'body3'
    | 'span'
  _as?: E
}

type TextProps<E extends ElementType> = textType<E> & Omit<ComponentProps<E>, keyof textType<E>>

const Component = {
  display1: { type: 'h1', className: css.display1 },
  display2: { type: 'h2', className: css.display2 },
  display3: { type: 'h3', className: css.display3 },
  headline1: { type: 'h4', className: css.headline1 },
  headline2: { type: 'h5', className: css.headline2 },
  headline3: { type: 'h6', className: css.headline3 },
  title1: { type: 'p', className: css.title1 },
  title2: { type: 'p', className: css.title2 },
  title3: { type: 'p', className: css.title3 },
  label1: { type: 'p', className: css.label1 },
  label2: { type: 'p', className: css.label2 },
  label3: { type: 'p', className: css.label3 },
  body1: { type: 'p', className: css.body1 },
  body2: { type: 'p', className: css.body2 },
  body3: { type: 'p', className: css.body3 },
  span: { type: 'span', className: '' }
} as const

const Text = <E extends ElementType>({
  children,
  color = 'text-primary',
  type = 'span',
  _as,
  weight,
  className,
  ...rest
}: TextProps<E>) => {
  const Tag = !!_as ? { type: _as, className: Component[type].className } : Component[type]

  const fontWeight = !!weight ? css[weight] : ''

  return (
    <Tag.type
      className={`${Component[type].className} ${css[color]} ${fontWeight} ${className}`}
      {...rest}
    >
      {children}
    </Tag.type>
  )
}
export default Text
