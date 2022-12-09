import { useEffect, useRef, useState } from 'react'

type UseIsInViewportProps_ = {
  rootMargin?: string
  threshold?: number
}

const useInViewport = ({ rootMargin = '0px', threshold }: UseIsInViewportProps_) => {
  const ref = useRef<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (element === null) return () => {}
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin,
      threshold
    })
    observer.observe(element)
    return () => {
      if (element) return
      observer.unobserve(element)
    }
  }, [ref, rootMargin, threshold])

  return { ref, isVisible }
}

export default useInViewport
