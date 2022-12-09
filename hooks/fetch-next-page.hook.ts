import { useCallback, useRef } from 'react'

type UseFetchNextPageParams_ = {
  fetchNextPage: (...args: any) => any
  isLoading: boolean
  hasNextPage: boolean
}

const useFetchNextPage = ({ fetchNextPage, isLoading, hasNextPage }: UseFetchNextPageParams_) => {
  const observer = useRef<any>()

  const callback = (node: any) => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })
    if (node) observer.current.observe(node)
  }

  return useCallback(callback, [fetchNextPage, isLoading, hasNextPage])
}

export default useFetchNextPage
