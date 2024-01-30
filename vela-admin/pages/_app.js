import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import "react-tabs/style/react-tabs.css";
import "/styles/globals.css";
import "/styles/custom-phorn.css";
import "/styles/custom-meiji.css";

const MyApp = ({ Component, pageProps }) => {
	const Layout = Component.layout || (({ children }) => <>{children}</>);
	return (
		<>
			<Head>
				<link
					rel="shortcut icon"
					href="/assets/images/logo-velaverse-s.svg"
				/>
				<title>Velaverse Admin</title>
			</Head>
			<SessionProvider session={pageProps.session} refetchInterval={0}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</SessionProvider>
		</>
	);
}

export default MyApp
