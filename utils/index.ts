import crypto from 'crypto'
import { AES, enc } from 'crypto-js'
import moment from 'moment'

import constants from '../config/constants'
import { GroupedMessageList, Message_ } from '../types/messaging.types'

/**
 * Sleep takes two params waitTime and callback function  and execute the callback function
 * after waitTime is completed
 * @param {number} waitTime
 * @param {() => void} callback
 * @returns {Promise} promise
 */
export const sleep = (waitTime: number, callback: () => void): Promise<any> =>
  new Promise(resolve => {
    setTimeout(() => {
      callback()
      resolve({})
    }, waitTime)
  })

//Encrypting text
export function encrypt(text: any) {
  const iv = crypto.randomBytes(16)
  let cipher = crypto.createCipheriv(constants.LS_ALGORITHM, Buffer.from(constants.LS_SECRET_KEY), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') }
}

// Decrypting text
export function decrypt(text: {
  iv:
    | WithImplicitCoercion<string>
    | {
        [Symbol.toPrimitive](hint: 'string'): string
      }
  encryptedData:
    | WithImplicitCoercion<string>
    | {
        [Symbol.toPrimitive](hint: 'string'): string
      }
}) {
  const iv = Buffer.from(text.iv, 'hex')
  const encryptedText = Buffer.from(text.encryptedData, 'hex')
  const decipher = crypto.createDecipheriv(constants.LS_ALGORITHM, Buffer.from(constants.LS_SECRET_KEY), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

export const numberFormat = (num: number, isShortNotation = false) =>
  new Intl.NumberFormat(
    undefined,
    isShortNotation
      ? {
          compactDisplay: 'short',
          notation: 'compact',
          maximumSignificantDigits: 4,
          minimumSignificantDigits: 1,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }
      : {}
  ).format(num)

export const dateFormat = (date: Date, isShort = false) => {
  const now = moment(new Date())

  const duration = moment.duration(now.diff(date))
  const minutes = Math.floor(duration.asMinutes())

  if (minutes < 5) return isShort ? 'now' : 'Just now'

  if (minutes < 60) return `${minutes}${isShort ? 'm' : ` min${minutes === 1 ? '' : 's'}`}`

  const hours = Math.floor(duration.asHours())

  if (hours < 24) return `${hours}${isShort ? 'h' : ` hour${hours === 1 ? '' : 's'}`}`

  const days = Math.floor(duration.asDays())

  if (days < 7) return `${days} ${isShort ? 'd' : ` day${days === 1 ? '' : 's'}`}`

  const weeks = Math.floor(duration.asWeeks())

  if (weeks < 4) return `${weeks}${isShort ? 'w' : ` week${weeks === 1 ? '' : 's'}`}`

  const months = Math.floor(duration.asMonths())

  if (isShort) return `${months}m`

  if (months < 4) return `${months}${` month${months === 1 ? '' : 's'}`}`

  return moment(date).format('LL')
}

export const addLeadZero = (num: number) => (num < 10 ? `0${num}` : `${num}`)

export const walletCardNoFormatter = (cardNo: string) =>
  cardNo
    .match(/.{1,4}/g)
    ?.join(' ')
    .trim()

export const addHttpToLink = (url: string) => (!/^https?:\/\//i.test(url) ? `https://${url}` : url)

/**
 * Takes the date as param and return true if date is today's date or returns false
 * @param date
 * @returns {boolean} true or false
 */
export const isToday = (date: Date): boolean => moment(date).isSame(moment().clone().startOf('day'), 'd')

export const ifElse = <C extends boolean, T, U>(
  condition: C,
  value1: T,
  value2: U
): T extends U ? T : C extends true ? T : U => {
  if (condition) return <T extends U ? T : C extends true ? T : U>value1
  return <T extends U ? T : C extends true ? T : U>value2
}

/**
 * Returns next page number if next page exists else it returns undefined
 * @param currentPage current page in pagination
 * @param pages Total number of pages
 * @returns next page number or undefined
 */
export const getNextPageParams = (currentPage: number, pages: number) => {
  const [_currentPage, _pages] = [parseInt(`${currentPage}`), parseInt(`${pages}`)]

  return _currentPage >= _pages ? undefined : _currentPage + 1
}
/**
 * Format the date passed in param
 * @param date
 * @returns Date in string format
 */
export const dateToFromNowDaily = (date: Date) =>
  moment(date).calendar(undefined, {
    lastWeek: 'dddd',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    sameElse: () => (moment(date).isSame(moment.now(), 'year') ? 'ddd DD, MMM' : 'MMM DD, YYYY')
  })

export const groupMessagesByDate = (messages: Message_[]) =>
  messages.reduce((group, message) => {
    const groupName = dateToFromNowDaily(message.createdAt)
    group[groupName] = group[groupName] ?? []
    group[groupName].push(message)
    return group
  }, {} as GroupedMessageList)
