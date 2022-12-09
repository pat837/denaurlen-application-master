import { IconButton } from '@mui/material'
import moment from 'moment'
import router from 'next/router'
import { useContext, useState } from 'react'

import { ifElse, numberFormat } from '../../utils'
import { ProfileContext } from '../../contexts/profile.context'
import css from '../../styles/components/ui/transaction-card.module.scss'
import { Transaction_, TransactionType_ } from '../../types/transactions.types'
import AddPostIcon from '../icons/add-post.icon'
import AddUserIcon from '../icons/add-user.icon'
import ArrowUpSquareIcon from '../icons/arrow-up-square.icon'
import CommentsIcon from '../icons/comments.icon'
import TrashIcon from '../icons/delete.icon'
import EyeIcon from '../icons/eye.icon'
import InfinityIcon from '../icons/infinity.icon'
import InterestingIcon from '../icons/interesting.icon'
import LikeIcon from '../icons/like.icon'
import RewardIcon from '../icons/reward.icon'
import RotateCCWIcon from '../icons/rotate-ccw.icon'
import TrendingUpIcon from '../icons/trending-up.icon'
import UnlockIcon from '../icons/unlock.icon'
import UserIcon from '../icons/user.icon'
import ConditionalRender from './conditional-render'

type TransactionCardProps_ = Transaction_

const getIcon = (transactionType: TransactionType_, isDebited: boolean) => {
  if (['SIGNUP', 'CATEGORIES', 'STORY_VIEW', 'REWARD'].some(type => type === transactionType))
    return <RewardIcon />

  if (['LIKE', 'LIKE_COMMENT'].some(type => type === transactionType)) return <LikeIcon />

  if (['INTERESTING', 'INTERESTING_COMMENT'].some(type => type === transactionType))
    return <InterestingIcon />

  if (['POST_GENERAL', 'POST_TOP10', 'STORY'].some(type => type === transactionType)) {
    if (isDebited) return <TrashIcon />
    return <AddPostIcon />
  }
  if ('COMMENT' === transactionType) {
    if (isDebited) return <TrashIcon />
    return <CommentsIcon />
  }
  if ('PROFILE_PIC' === transactionType) {
    if (isDebited) return <TrashIcon />
    return <UserIcon />
  }
  if ('FOLLOW' === transactionType) return <AddUserIcon />

  if ('POST_VALUATION' === transactionType) return <AddPostIcon />

  if ('SPEND' === transactionType) return <EyeIcon />

  if ('CLAIM' === transactionType) return <ArrowUpSquareIcon />

  if ('LEAD' === transactionType) return <TrendingUpIcon />

  if ('REVERT' === transactionType) return <RotateCCWIcon />

  if ('INFINITY' === transactionType) return <InfinityIcon />

  if ('BIO' === transactionType) {
    if (isDebited) return <UnlockIcon />
    return <RotateCCWIcon />
  }

  return <></>
}

const getDesc = (isDebited: boolean, dr: string, cr: string) => {
  if (isDebited) return `You started following ${cr}`
  return `${dr} started following you`
}

const TransactionCard = ({
  amount,
  cr_Account,
  createdAt,
  dr_Account,
  description,
  transactionType
}: TransactionCardProps_) => {
  const { profile } = useContext(ProfileContext)

  const crAccount =
    typeof cr_Account === 'string'
      ? { _id: '', username: 'denaurlen', isAccount: false }
      : { ...cr_Account, isAccount: true }
  const drAccount =
    typeof dr_Account === 'string'
      ? { _id: '', username: 'denaurlen', isAccount: false }
      : { ...dr_Account, isAccount: true }

  const isDebited = drAccount._id === profile._id
  const account = ifElse(isDebited, { ...crAccount, type: 'to' }, { ...drAccount, type: 'from' })

  const [showDesc, setShowDesc] = useState(false)

  const toggleDescription = () => setShowDesc(!showDesc)

  return (
    <div className={css.wrapper}>
      <div className={css.card}>
        <div>
          <IconButton className={css.icon} onClick={toggleDescription}>
            {getIcon(transactionType, isDebited)}
          </IconButton>
        </div>
        <div className={css.info}>
          <div className={css.account}>
            <span data-type={account.type}>
              <ConditionalRender condition={account.isAccount}>
                <a onClick={() => router.push(`/${account.username}`)}>{account.username}</a>
                {account.username}
              </ConditionalRender>
            </span>
          </div>
          <time>{moment(createdAt).format('[at] hh:mm a, MMM D yyyy')}</time>
        </div>
        <code>
          <span className={ifElse(isDebited, css.debit, undefined)}>{ifElse(isDebited, '-', '+')}</span>
          {numberFormat(amount)}
        </code>
      </div>
      <div className={`${css.description} ${ifElse(showDesc, '', css.hide)}`}>
        <p>
          {ifElse(
            transactionType === 'FOLLOW',
            getDesc(isDebited, drAccount.username, crAccount.username),
            description
          )}
        </p>
      </div>
    </div>
  )
}

export default TransactionCard
