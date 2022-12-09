import { ComponentProps, ElementType, useState } from 'react'

import css from '../../styles/components/ui/read-more.module.scss'
import Linkify from './linkify'

type textType<E extends ElementType> = {
  text: string
  maxLength?: number
  tag?: E
}

type ReadMoreProps_<E extends ElementType> = textType<E> & Omit<ComponentProps<E>, keyof textType<E>>

const ReadMore = <E extends ElementType = 'span'>({
  tag,
  text,
  maxLength = 75,
  ...rest
}: ReadMoreProps_<E>) => {
  const [showMore, setShowMore] = useState(false)

  const Tag: ElementType = tag || 'span'

  const toggleShowMore = () => setShowMore(!showMore)

  const toggleMore = (
    <a role="button" onClick={toggleShowMore} className={css.button}>
      {showMore ? 'hide' : 'read more'}
    </a>
  )

  if (text.split('').some(char => char === '\n'))
    return (
      <Tag>
        {showMore ? (
          <Linkify text={text} />
        ) : (
          <>{`${text.slice(0, text.indexOf('\n')).slice(0, 25)}...`}</>
        )}{' '}
        {toggleMore}
      </Tag>
    )

  if (text.length <= maxLength)
    return (
      <Tag>
        <Linkify text={text} />
      </Tag>
    )

  return (
    <Tag {...rest}>
      {showMore ? <Linkify text={text} /> : <>{`${text.slice(0, maxLength - 5)}...`}</>} {toggleMore}
    </Tag>
  )
}

export default ReadMore
