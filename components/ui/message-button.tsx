import useMessageHandler from '../../hooks/message-handler.hook'
import Button from './button'

const MessageButton = ({ profileId }: { profileId: string }) => {
  const messageHandler = useMessageHandler()

  const clickHandler = () => messageHandler(profileId)

  return <Button label="message" variant="contained" onClick={clickHandler} />
}

export default MessageButton
