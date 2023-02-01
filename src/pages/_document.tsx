import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

import { FB_PIXEL_ID } from '../../lib/fpixel'

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="pt">
        <Head>
          <meta
            name="google-site-verification"
            content="_Q4VceB9nkxq1gr3xs6OIaihigWi3koE1r-0DdRP91U"
          />

          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>

          <meta charSet="utf-8" />

          <link
            href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,700"
            rel="stylesheet"
          />

          <link
            rel="icon"
            href="https://chaes-upload-photos.s3.sa-east-1.amazonaws.com/others/icone-chaes.svg"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
