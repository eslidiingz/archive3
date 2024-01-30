// import 'bootstrap/dist/css/bootstrap.min.css'
import Head from "next/head";
import "../public/assets/font-awesome/css/all.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import '../public/assets/css/style.css'
import "/public/assets/css/style1.css";
import "/public/assets/css/style2.css";
import "/public/assets/css/style-aon.css";
import WalletProvider from "/context/wallet";
import { ApolloProvider } from "@apollo/client"
import { gqlClient } from "../utils/providers/graphqlClient"
import { SSRProvider } from "react-bootstrap";

export const apolloClient = gqlClient;

function MyApp({ Component, pageProps }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <>
      <ApolloProvider client={gqlClient}>
        <Head>
          <link rel="icon" type="image/png" href="../logo.svg"></link>
          <meta name="description" content="Siamcannabis" />
          <meta name="keywords" content="Siamcannabis" />
          <meta property="og:title" content="Siamcannabis" />
          <meta property="og:type" content="Siamcannabis" />
          <meta property="og:description" content="Easy Invest , Easy Profit with Siamcannabis.io" />
			    <meta property="og:image" content="https://siamcannabis.io/assets/image/nav/logoW.png" />
          
          <title>Siamcannabis</title>
          <link
            href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Russo+One&display=swap"
            rel="stylesheet"
          ></link>

          <link
            rel="stylesheet"
            type="text/css"
            charSet="UTF-8"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
        </Head>
        <SSRProvider>
          <WalletProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WalletProvider>
        </SSRProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
