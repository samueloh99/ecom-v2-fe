import { AppProps } from 'next/app'
import Script from 'next/script'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { ChakraProvider } from '@chakra-ui/react'

import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import { chakraTheme } from '../styles/chakraTheme'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import { CartDrawerProvider } from '../contexts/CartDrawerContext'
import { FreteGratisProvider } from '../contexts/FreteGratisContext'
import { ParcelaContextProvider } from '../contexts/ParcelaContext'
import { queryClient } from '../services/queryClient'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/bundle'

import 'react-image-gallery/styles/scss/image-gallery.scss'

import 'react-image-gallery/styles/css/image-gallery.css'

import * as gtag from '../../lib/gtag'

import * as fbq from '../../lib/fpixel'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = url => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    // This pageview only triggers the first time (it's important for Pixel to have real information)
    fbq.pageview()

    const handleRouteChange = () => {
      fbq.pageview()
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          `
        }}
      />

      <Script
        src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"
        strategy="beforeInteractive"
      />

      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `
        }}
      />
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <FreteGratisProvider>
            <CartDrawerProvider>
              <ParcelaContextProvider>
                <AuthProvider>
                  <ChakraProvider theme={chakraTheme}>
                    <Component {...pageProps} />
                  </ChakraProvider>
                </AuthProvider>
              </ParcelaContextProvider>
            </CartDrawerProvider>
          </FreteGratisProvider>
        </CartProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  )
}
export default MyApp
