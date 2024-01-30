import InputForm from "../../components/form/InputLogin";
import ButtonLogin from "../../components/button/ButtonLogin";
import Link from 'next/link'

const LoginWeb = () => {
  return (
    <>
      <section className="height-VH">
        <div className="img-bg-login h-full">
          <div className=" lg:container xl:px-4 mx-auto ">
            <div className="content-login">
                <div className="grid sm:grid-cols-2 grid-cols-1 mt-48 sm:mt-0 mb-4 sm:mb-0 gap-4">
                  <div className="col-span-full flex justify-center">
                    <img src="/assets/image/logo-green.png" alt="" width={200} />
                  </div>
                  <div className="col-span-full flex justify-center my-4">
                    <p className="text-white">Sign In or Create an Account</p>
                  </div>
                  <div className="pl-0 lg:pl-32 xl:pl-60">
                    <Link href="#">
                      <div className="btn-login-L p-8 rounded-3xl h-full">
                          <div className="text-xl text-black font-semibold text-center">SIGN IN WITH</div>
                          <div className="text-4xl text-black font-semibold text-center">METAMASK</div>
                          <img className="mx-auto my-10" src="/assets/image/metamask.png" alt="" height={180} />
                          <p className="text-[#646769] text-center text-xl">Connect your account to fully enjoy Velaverse</p>
                      </div>
                    </Link>
                  </div>
                  <div className="pr-0 lg:pr-32 xl:pr-60">
                    <Link href="#">
                      <div className="btn-login-L p-8 rounded-3xl h-full">
                          <div className="text-xl text-black font-semibold text-center">PLAY AS</div>
                          <div className="text-4xl text-black font-semibold text-center">GUEST</div>
                          <img className="mx-auto my-10" src="/assets/image/ghost.png" alt="" height={180} />
                          <p className="text-[#646769] text-center text-xl">You information will be locally stored and your experience limited</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginWeb;
