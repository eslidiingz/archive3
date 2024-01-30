import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { getSession, signIn } from "next-auth/react"
import { getWalletAccount } from "../../utils/web3/init";
import { registerByOAuth } from '../../utils/api/account-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faTimes } from '@fortawesome/free-solid-svg-icons';

const OAuth = ({ session = {} }) => {
    const router = useRouter();
    const providers = ['google', 'facebook'];

    const [loading, setLoading] = useState(true);
    const [signinResult, setSigninResult] = useState({
        status: false,
        message: ''
    });

    useEffect(() => {
        if (session?.user && router.isReady && providers.includes(router.query.provider)) {
            initialize({ email: session.user.email });
        }
    }, [router.isReady]);

    const initialize = async ({ email }) => {
        const walletAddress = await getWalletAccount();
        const response = await registerByOAuth({ walletAddress, provider: router.query.provider, email });

        if (response.error) {
            setSigninResult({ status: false, message: response.error.message });
        } else if (response?.status) {
            setSigninResult({ status: true, message: response.message })
        }

        setLoading(false);

        setTimeout(() => {
            router.push('/market');
        },5000);
    };

    return (
        <div className="oAuth-container">
            {loading && (
                <div>
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            )}

            {!loading && (
                <h3>{signinResult.status ? <FontAwesomeIcon size="lg" icon={faCheck} className="text-green-600 mr-3" /> : <FontAwesomeIcon size="lg" icon={faTimes} className="text-red-800 mr-3" />}{signinResult.message}</h3>
            )}
        </div>);
};

export async function getServerSideProps(context) {
    const session = await getSession(context);

    return {
        props: {
            session
        },
    }
}

export default OAuth;