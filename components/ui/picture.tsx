import NextImage from 'next/image'

import { getMediaURL } from '../../utils/get-url'

type PictureProps_ = {
  width?: string
  height?: string
  aspectRatio?: string
  src: string
  isSrcAbsolute?: boolean
  alt: string
  quality?: number
  objectFit?: 'cover' | 'contain'
  onLoad?: () => any
  removeRapper?: boolean
}

const imageLoader = ({ src, width, quality }: any) => {
  return `${src}?w=${width}&q=${quality || 100}`
}

const Picture = ({
  width = '100%',
  height = '100%',
  aspectRatio = '1',
  src,
  isSrcAbsolute = false,
  quality = 100,
  alt,
  objectFit = 'cover',
  onLoad,
  removeRapper = false
}: PictureProps_) => {
  const url = isSrcAbsolute ? src : getMediaURL(src)

  if (removeRapper)
    return (
      <NextImage
        loader={imageLoader}
        src={url}
        alt={alt}
        layout="fill"
        objectFit={objectFit}
        loading="lazy"
        quality={quality}
        onLoad={onLoad}
      />
    )

  return (
    <div style={{ width, height, aspectRatio, position: 'relative' }}>
      <NextImage
        loader={imageLoader}
        src={url}
        alt={alt}
        layout="fill"
        objectFit={objectFit}
        loading="lazy"
        quality={quality}
        onLoad={onLoad}
      />
    </div>
  )
}

export default Picture
