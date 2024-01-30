import InputForm from "../../components/form/InputLogin";
import ButtonLogin from "../../components/button/ButtonLogin";
import Link from 'next/link'

const LoginWeb = () => {
  return (
    <>
      <section className="height-VH">
        <div className="img-bg-login h-full">
          <div className=" md:container px-4 mx-auto ">
            <div className="content-login">
              <div className="grid  lg:grid-cols-2 grid-cols-1 max-width-grid">
                <div className="relative ci-bg-login rounded-l-lg hidden lg:block">
                    <img className="w-full mx-auto rounded-l-lg absolute innrt-bg-login" src="/assets/image/Glob2.png" />
                    <div className="absolute absolute-top-logo">
                      <img className="w-1/2" src="/assets/image/logo-green.png" />
                    </div>
                </div>
                <div className="text-center text-black ci-bg-green rounded-r-lg  lg:rounded-l-[0px] rounded-l-lg pt-10 pb-5 relative">
                  <div className="leading-10 mb-10">
                    <p className="font-DBAiry font-semibold">SIGN IN TO</p>
                    <h2 className="font-36-64 font-DBAiry font-semibold">VELAVERSE</h2>
                  </div>
                  <div className="md:px-12 px-10">
                    <InputForm
                      className="my-10"
                      title="Username"
                      type="text"
                      placeholder="Enter username"
                    />
                    <InputForm
                      className="my-10"
                      title="Password"
                      type="password"
                      placeholder="Enter username"
                      texterror="The password is not correct."
                    />
                    <ButtonLogin text="SIGN IN" />
                    <div className="flex items-center gap-2 my-3">
                      <hr className="lineLogin" />
                      <div className="font-DBAiry text-[#3B726A] Font-16-24 font-medium">
                        OR
                      </div>
                      <hr className="lineLogin" />
                    </div>
                  </div>
                  <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:grid-cols-1  gap-2  md:px-12 px-10 ">
                    <button
                      type="buttom"
                      className=" btn-login rounded-full display-btn-fig"
                    >
                      <img
                        className="w-10"
                        src="/assets/image/logo-metamask 1.png"
                      />
                      <div className="text-left px-2">
                        <p className="text-xs">SIGN IN WITH</p>{" "}
                        <p className="text-lg font-medium">METAMASK</p>
                      </div>
                    </button>
                    <button
                      type="buttom"
                      className=" btn-login rounded-full display-btn-fig"
                    >
                      <img className="w-10" src="/assets/image/Ghost 1.png" />
                      <div className="text-left px-2">
                        <p className="text-xs">SIGN IN WITH</p>{" "}
                        <p className="text-lg font-medium">GUEST</p>
                      </div>
                    </button>
                  </div>
                  <div className="mt-4 font-semibold tracking-wide ci-green">
                    Sign in with 
                    <Link href="/login/passcode">
                      <span className="text-white cursor-pointer ml-2">Passscode</span>
                    </Link>
                  </div>
                  <div className="md:px-12 px-10 mt-3 mb-4">
                    <p className="ci-green">
                      Do not have an Account? go to{" "}
                      <span className="text-white">
                       <Link href="/register"><a >Register</a></Link> 
                      </span>{" "}
                      or you forget your password go to{" "}
                      <span className="text-white">
                       <Link href="/renew-password"><a >Renew Password</a></Link> 
                      </span>{" "}
                      .
                    </p>
                  </div>
                  <div className="md:px-12 px-10 mt-10 ">
                    <p className="text-[#3B726A] whitespace-nowrap">© 2022 Velaverse</p>
                  </div>
                </div>
                <div className="col-span-full flex justify-center py-2 hidden lg:block">
                  <div className="oval mx-auto"></div>
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
