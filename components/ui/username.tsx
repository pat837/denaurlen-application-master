import { useRouter } from 'next/router'
import { ComponentProps } from 'react'

const Username = ({
  username,
  ...rest
}: Omit<ComponentProps<'p'>, 'children'> & { username: string }) => {
  const router = useRouter()

  const clickHandler = () => router.push(`/${username}`)

  return (
    <p {...rest} role="button" tabIndex={0} onClick={clickHandler}>
      {username}
    </p>
  )
}

export default Username
