import router from 'next/router'

import { postType_ } from '../../../api-routes/posts/post-like/post-like.routes'
import usePopup from '../../../hooks/popup.hook'
import Popup from '../../ui/popup'
import LikesList from './likes-list'
import { CategoryPostHeader, GeneralPostHeader, ValuationPostHeader } from './post-like-header'
import css from './post-popup.module.scss'

const PostLikesPopup = () => {
  const { type, postId } = router.query

  const { isOpen, closePopup } = usePopup()

  const header = {
    general: <GeneralPostHeader postId={(postId as string) || ''} />,
    category: <CategoryPostHeader postId={(postId as string) || ''} />,
    valuation: <ValuationPostHeader postId={(postId as string) || ''} />
  }

  return (
    <Popup open={isOpen('post-likes')} isPage onClose={closePopup}>
      <div className={css.wrapper}>
        <div className={css.container}>
          {isOpen('post-likes') && type !== undefined && postId !== undefined && (
            <div className={css.content_wrapper}>
              {header[type as postType_]}
              <LikesList type={type as postType_} postId={postId as string} />
            </div>
          )}
        </div>
      </div>
    </Popup>
  )
}

export default PostLikesPopup
