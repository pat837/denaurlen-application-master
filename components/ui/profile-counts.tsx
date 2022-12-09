import useGetPostCounts from '../../api-routes/posts/useGetPostCounts'
import { useGetFollowFollowingCounts } from '../../api-routes/Profile'
import useFetchCommunityCounts from '../../api-routes/profile-queries/fetch-community-counts'
import { numberFormat as format } from '../../utils'
import Text from './text-with-loader'

export const NoOfFollowers = ({ username }: { username: string }) => {
  const { data, isLoading } = useGetFollowFollowingCounts(username)

  return <Text loading={isLoading} text={format(data?.followersCount || 0, true) || ''} length={3} />
}

export const FollowingCount = ({ username }: { username: string }) => {
  const { data, isLoading } = useGetFollowFollowingCounts(username)

  return <Text loading={isLoading} text={format(data?.followingCount || 0, true) || ''} length={3} />
}

export const NoOfPost = ({ username }: { username: string }) => {
  const { data, isLoading } = useGetPostCounts(username)

  const count = !data
    ? 0
    : (data?.categoryPosts || 0) +
      (data?.generalPosts || 0) +
      (data?.valuation?.collection || 0) +
      (data?.valuation?.onGoing || 0)

  return <Text loading={isLoading} text={format(count, true) || '0'} length={3} />
}

export const NoOfCategoryPost = ({ username }: { username: string }) => {
  const { data, isLoading } = useGetPostCounts(username)
  return (
    <span>
      {'('}
      <Text loading={isLoading} text={data?.categoryPosts || 0 || '0'} length={3} />
      {'/100)'}
    </span>
  )
}
export const NoOfGeneralPost = ({ username }: { username: string }) => {
  const { data, isLoading } = useGetPostCounts(username)
  return (
    <span>
      {'('}
      <Text loading={isLoading} text={format(data?.generalPosts || 0, true) || '0'} length={3} />
      {')'}
    </span>
  )
}

export const NoOfValuationPost = ({ username }: { username: string }) => {
  const { data, isLoading } = useGetPostCounts(username)
  return (
    <span>
      {'('}
      <Text loading={isLoading} text={data?.valuation.collection || '0'} length={3} />
      {')'}
    </span>
  )
}

export const NoOfValuedPost = ({ username }: { username: string }) => {
  // const { data, isLoading } = useGetPostCounts(username)
  return (
    <span>
      {'('}
      <Text loading={false} text={0 || '0'} length={3} />
      {')'}
    </span>
  )
}

export const CommunityCount = ({ username }: { username: string }) => {
  const { data, isLoading } = useFetchCommunityCounts(username)

  return <Text loading={isLoading} text={format(data?.communityCount || 0, true) || '0'} length={2} />
}

export const MyCommunityCount = ({ username }: { username: string }) => {
  const { data, isLoading } = useFetchCommunityCounts(username)

  return <Text loading={isLoading} text={format(data?.myCommunityCount || 0, true) || '0'} length={2} />
}
