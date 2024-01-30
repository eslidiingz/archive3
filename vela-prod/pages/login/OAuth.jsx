import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn } from "next-auth/react";
import { getWalletAccount } from "../../utils/web3/init";

import { ToastDisplay } from "../../components/ToastDisplay";
import { toast } from "react-toastify";

const OAuth = () => {
    const router = useRouter();
    const providers = ['google', 'facebook'];

    useEffect(() => {
        if (router.isReady) initialize();
    }, [router.isReady]);

    const initialize = async () => {
        try {
            if (window?.ethereum && providers.includes(router.query.provider)) {
                const permission = await ethereum.request({
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }]
                });
                
                if (permission?.length) {
                    return signIn(router.query.provider, { callbackUrl: `/register/OAuth?provider=${router.query.provider}` });
                }else{
                    return toast(<ToastDisplay type="error" title="Failed" description="Please connect to MetaMask!" />);
                }
            }

            return router.push('/market');
        } catch (e){
            const walletAddress = await getWalletAccount();
            if(!walletAddress){
                return toast(<ToastDisplay type="error" title="Failed" description="Please connect to MetaMask!" />);
            }

            return signIn(router.query.provider, { callbackUrl: `/register/OAuth?provider=${router.query.provider}` });

        }
    };

    return (<div></div>)
};

export default OAuth;