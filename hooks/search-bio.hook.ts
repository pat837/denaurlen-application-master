import axios from 'axios'
import { useEffect, useState } from 'react'

import http from '../config/http'

type UseSearchBios_ = {
  input: string
  pageNumber: number
  size?: number
  length?: number
  isOwnBio?: boolean
}

const useSearchBios = ({ input, pageNumber, size = 7, length = 0, isOwnBio = false }: UseSearchBios_) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [inputs, setInputs] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setInputs([])
  }, [input])

  useEffect(() => {
    if (!input || input.length < length) return

    setLoading(true)
    setError(false)

    let cancel = () => {}

    http({
      method: 'GET',
      url: `/user/${isOwnBio ? 'bios-owned' : 'bios'}/${input}`,
      params: { page: pageNumber, size: size },
      cancelToken: new axios.CancelToken(c => (cancel = c))
    })
      .then(({ data }) => {
        setHasMore(data.currentPage < data.pages)
        setInputs(inputs => [...Array.from(new Set([...inputs, ...data.data]))])
      })
      .catch(e => {
        if (axios.isCancel(e)) return
        setError(true)
      })
      .finally(() => setLoading(false))

    return () => cancel()
  }, [length, pageNumber, size, input, isOwnBio])

  return { loading, error, bios: inputs, hasMore }
}

export default useSearchBios
