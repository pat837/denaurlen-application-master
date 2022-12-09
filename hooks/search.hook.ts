import axios from 'axios'
import { useEffect, useState } from 'react'

import http from '../config/http'

const useSearch = (user: string, pageNumber: number, size = 7, length = 0) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setUsers([])
  }, [user])

  useEffect(() => {
    if (!user || user.length < length) return undefined

    setLoading(true)
    setError(false)

    let cancel = () => {}

    http({
      method: 'GET',
      url: `/user/search/${user}`,
      params: { page: pageNumber, size: size },
      cancelToken: new axios.CancelToken(c => (cancel = c))
    })
      .then(({ data }) => {
        setHasMore(data.currentPage < data.pages)
        setUsers(users => [...Array.from(new Set([...users, ...data.data]))])
      })
      .catch(e => {
        if (axios.isCancel(e)) return
        setError(true)
      })
      .finally(() => setLoading(false))

    return () => cancel()
  }, [length, pageNumber, size, user])

  return { loading, error, users, hasMore }
}

export default useSearch
