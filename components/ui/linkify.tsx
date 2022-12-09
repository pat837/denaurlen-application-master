import { Link } from '@mui/material'
import { Fragment } from 'react'

import constants from '../../config/constants'

type HashtagParams_ = {
  hashtags: string[]
  word: string
}

type UserTagParams_ = {
  usernames: string[]
  word: string
}

const hashtag = ({ hashtags, word }: HashtagParams_) => {
  const hashtag = hashtags.find(hashtag => word.includes(hashtag))
  if (hashtag === undefined) return <>{word} </>

  if (hashtag.length === word.length)
    return (
      <>
        <Link href={`/hashtags/${hashtag.slice(1)}`}>{hashtag}</Link>{' '}
      </>
    )

  const at = word.indexOf(hashtag)
  return (
    <>
      {at === 0 || word.slice(0, at)}
      <Link href={`/hashtags/${hashtag.slice(1)}`}>{hashtag}</Link>
      {at === 0 && word.slice(hashtag.length)}{' '}
    </>
  )
}
const userTag = ({ usernames, word }: UserTagParams_) => {
  const username = usernames.find(username => word.includes(username))
  if (username === undefined) return <>{word} </>

  if (username.length === word.length)
    return (
      <>
        <Link href={`/${username.slice(1)}`}>{username}</Link>{' '}
      </>
    )

  const at = word.indexOf(username)
  return (
    <>
      {at === 0 || word.slice(0, at)}
      <Link href={`/${username.slice(1)}`}>{username}</Link>
      {at === 0 && word.slice(username.length)}{' '}
    </>
  )
}

const linkifyString = (text: string) => {
  const usernames = text.match(constants.USERNAME_DETECT_REGEX) || []
  const hashtags = text.match(constants.HASHTAG_DETECT_REGEX) || []
  const words = text.split(' ')

  if (usernames.length === 0 && hashtags.length === 0) return <>{text}</>

  if (usernames.length === 0)
    return (
      <>
        {words.map((word, index) => (
          <Fragment key={index}>{hashtag({ hashtags, word })}</Fragment>
        ))}
      </>
    )

  if (hashtags.length === 0)
    return (
      <>
        {words.map((word, index) => (
          <Fragment key={index}>{userTag({ usernames, word })}</Fragment>
        ))}
      </>
    )

  return (
    <Fragment>
      {words.map((word, index) => {
        if (usernames.some(username => word.includes(username)))
          return <Fragment key={index}>{userTag({ usernames, word })}</Fragment>

        if (hashtags.some(hashtag => word.includes(hashtag)))
          return <Fragment key={index}>{hashtag({ hashtags, word })}</Fragment>

        return <Fragment key={index}>{word} </Fragment>
      })}
    </Fragment>
  )
}

const Linkify = ({ text }: { text: string }) => {
  return <>{linkifyString(text)}</>
}

export default Linkify
