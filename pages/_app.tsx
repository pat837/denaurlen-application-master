import '../styles/globals.scss'

import Script from 'next/script'
import { Provider } from 'react-redux'

import { Root } from '../components/ui/app-root'
import constants from '../config/constants'
import AuthContextProvider from '../contexts/auth.context'
import ThemeContextProvider from '../contexts/theme.context'
import store from '../data/store'
import { AppProps } from '../types'
import ErrorBoundary from '../components/error-boundary'

const MyApp = ({ Component, pageProps, ...rest }: AppProps) => (
  <ErrorBoundary>
    <ThemeContextProvider>
      <Provider store={store}>
        <AuthContextProvider>
          <Root Component={Component} {...rest} pageProps={pageProps} />
        </AuthContextProvider>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${constants.API_KEY}&libraries=places`}
        />
        {typeof window !== 'undefined' && window?.location?.origin.includes('.com') && (
          <>
            <Script async src="https://www.googletagmanager.com/gtag/js?id=G-ZVNKLY6M3M" />
            <Script
              strategy="afterInteractive"
              src="https://www.googletagmanager.com/gtag/js?id=G-ZVNKLY6M3M"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZVNKLY6M3M');
            `}
            </Script>
          </>
        )}
      </Provider>
    </ThemeContextProvider>
  </ErrorBoundary>
)

export default MyApp
