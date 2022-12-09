import useToastMessage from './toast-message.hook'

const useShareOption = () => {
  const showToast = useToastMessage()

  return (shareDate: ShareData) => {
    navigator.share(shareDate).catch(() => showToast('Unable to copy, try again'))
  }
}

export default useShareOption
