import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <link
            rel="icon"
            type="image/x-icon"
            href="/assets/image/favicon.png"
          ></link>
          <title>Velaverse NFT Market | Where everyone is EQUAL.</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          {/* <link
            rel="shortcut icon"
            href={require("../public/assets/image/favicon.png")}
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href={require("../public/assets/image/favicon.png")}
          /> */}
          {/* Fonts and icons */}
          {/* <link
            href="https://fonts.googleapis.com/css2?family=Martel:wght@300;400;600;700;800&family=Prompt:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Tienne:wght@400;700;900&display=swap'"
            rel="stylesheet"
          /> */}
          <link
            href="https://fonts.googleapis.com/css2?family=Martel:wght@300;400;600;700;800&family=Prompt:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Tienne:wght@400;700;900&display=swap'"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://use.typekit.net/dzp1raj.css"
          ></link>
        </Head>
        <body className="g-sidenav-show g-sidenav-pinned">
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;