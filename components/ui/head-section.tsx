import NextHead from 'next/head'
import { useContext } from 'react'
import { useSelector } from 'react-redux'

import { ThemeContext } from '../../contexts/theme.context'
import { storeType } from '../../types'

const Head = () => {
  const { mode } = useContext(ThemeContext)
  const { title } = useSelector((s: storeType) => s.appbar)

  const url = window?.location?.origin || ''

  return (
    <NextHead>
      <link rel="icon" href="/favicon.ico" />
      <meta httpEquiv="Cache-control" content="private" />
      <meta name="application-name" content="Denaurlen" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Denaurlen" />
      <meta name="description" content="Know yourself First!" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#4b0082" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content={mode === 'DARK' ? '#000' : '#fff'} />

      <link rel="apple-touch-icon" href="/icons/icon-512x512.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-512x512.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />

      <link rel="icon" type="image/ico" sizes="32x32" href="/favicon.ico" />
      <link rel="icon" type="image/ico" sizes="16x16" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#FFF" />
      <link rel="shortcut icon" href="/favicon.ico" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content="Denaurlen" />
      <meta name="twitter:description" content="Denaurlen" />
      <meta name="twitter:image" content={`${url}/icons/android-chrome-192x192.png`} />
      <meta name="twitter:creator" content="@Tagore" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Denaurlen" />
      <meta property="og:description" content="Know yourself First!" />
      <meta property="og:site_name" content="Denaurlen" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${url}/icons/icon-512x512.png`} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no;" />

      <link rel="apple-touch-startup-image" href="/images/apple_splash_2048.png" sizes="2048x2732" />
      <link rel="apple-touch-startup-image" href="/images/apple_splash_1668.png" sizes="1668x2224" />
      <link rel="apple-touch-startup-image" href="/images/apple_splash_1536.png" sizes="1536x2048" />
      <link rel="apple-touch-startup-image" href="/images/apple_splash_1125.png" sizes="1125x2436" />
      <link rel="apple-touch-startup-image" href="/images/apple_splash_1242.png" sizes="1242x2208" />
      <link rel="apple-touch-startup-image" href="/images/apple_splash_750.png" sizes="750x1334" />
      <link rel="apple-touch-startup-image" href="/images/apple_splash_640.png" sizes="640x1136" />
      <title>{title} | DENAURLEN</title>
    </NextHead>
  )
}

export default Head
