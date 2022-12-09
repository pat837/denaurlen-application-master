import useToastMessage from './toast-message.hook'

type CopyToClipboardParams_ = {
  copyText: string
  message: string
}

const useCopyToClipboard = () => {
  const showToast = useToastMessage()

  return ({ copyText, message }: CopyToClipboardParams_) => {
    try {
      navigator.clipboard.writeText(copyText)
      showToast(message)
    } catch (error) {
      showToast('Unable to copy, try again')
    }
  }
}

export default useCopyToClipboard
