import { Skeleton } from '@mui/material'

const TextWithLoader = ({
  loading,
  text,
  length = 4
}: {
  loading: boolean
  text: string | undefined | number
  length?: number
}) =>
  loading || text === undefined ? (
    <Skeleton sx={{ display: 'inline-block' }} variant="text" width={`${length}ch`} />
  ) : (
    <>{text}</>
  )

export default TextWithLoader
