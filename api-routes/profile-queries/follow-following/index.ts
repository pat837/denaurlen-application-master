import http from '../../../config/http'

const followFollowingQueries = {
  isFollowing: (userId: string) => http.get(`/user/is-following/${userId}`),
}

export default followFollowingQueries
