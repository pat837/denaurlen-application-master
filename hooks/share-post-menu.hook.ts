import usePopup from './popup.hook'

type UseSharePostMenuProps =
  | {
      type: 'post'
      isForward: boolean
      postId?: string
    }
  | {
      type: 'message'
      isForward: boolean
      message?: string
      postId?: string
    }

const useSharePostMenu = (params: UseSharePostMenuProps) => {
  const { openPopup } = usePopup()

  return () => {
    openPopup('post-share-menu', { params })
  }
}

export default useSharePostMenu
