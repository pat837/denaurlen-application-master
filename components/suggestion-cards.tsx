import { IconButton } from '@mui/material'
import { CSSProperties, useState } from 'react'

import useFetchSuggestions from '../api-routes/profile-queries/suggestions'
import { sleep } from '../utils'
import useFetchNextPage from '../hooks/fetch-next-page.hook'
import css from '../styles/components/ui/suggestions-container.module.scss'
import homeCSS from '../styles/pages/home.module.scss'
import { Suggestion_ } from '../types/profile.type'
import XIcon from './icons/x.icon'
import Avatar from './ui/avatar'
import { FollowButton } from './ui/follow-buttons'
import Username from './ui/username'

const SuggestionCard = ({ profile }: { profile: Suggestion_ }) => {
  const [hide, setHide] = useState(false)
  const [displayNone, setDisplayNone] = useState(false)

  return (
    <div className={`${css.suggestion_card} ${hide && css.fade} ${displayNone && css.hide}`}>
      <Avatar url={profile.profilePic} alt={profile.name} className={css.avatar} />
      <div className={css.close_btn}>
        <IconButton
          aria-label="close"
          onClick={() => {
            setHide(true)
            sleep(900, () => {
              setDisplayNone(true)
            })
          }}
        >
          <XIcon />
        </IconButton>
      </div>
      <div className={css.name_wrapper}>
        <Username username={profile.username} />
        <span>{profile.name}</span>
      </div>
      <FollowButton userId={profile._id} username={profile.username} />
    </div>
  )
}

const SuggestionCards = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchSuggestions(10)

  const nextPageTrigger = useFetchNextPage({
    fetchNextPage,
    isLoading: isFetchingNextPage,
    hasNextPage: hasNextPage || false
  })

  if (isLoading || !data?.pages[0].length) return <></>

  return (
    <>
      <div className={css.container}>
        <h6>Suggestions</h6>
        <div
          className={css.w}
          style={{ '--columns': data?.pages.reduce((a, b) => a + b.length, 0) } as CSSProperties}
        >
          {data?.pages.map((page, pageNo) => {
            const isLastPage = data.pages.length === pageNo + 1

            return page.map((profile, index) => (
              <div
                ref={isLastPage && index === 0 ? nextPageTrigger : undefined}
                className={css.ref_wrapper}
                key={profile._id}
              >
                <SuggestionCard profile={profile} />
              </div>
            ))
          })}
        </div>
      </div>
      <div className={homeCSS.gap} />
    </>
  )
}

export default SuggestionCards
