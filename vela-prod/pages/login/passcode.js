import InputForm from "../../components/form/InputLogin";
import ButtonLogin from "../../components/button/ButtonLogin";
import Link from 'next/link'

const Passcode = () => {
  return (
    <>
      <section className="height-VH">
        <div className="img-bg-login h-full">
          <div className=" md:container px-4 mx-auto ">
            <div className="content-login">
              <div className="grid lg:grid-cols-2 grid-cols-1 max-width-grid ">
                <div className="relative ci-bg-login rounded-l-lg hidden lg:block">
                  <img className="w-full mx-auto rounded-l-lg absolute innrt-bg-login" src="/assets/image/Glob2.png" />
                  <div className="absolute absolute-top-logo">
                    <img className="w-1/2" src="/assets/image/logo-green.png" />
                  </div>
                </div>
                <div className="text-center text-black ci-bg-green rounded-r-lg  lg:rounded-l-[0px] rounded-l-lg pt-20 relative">
                  <div className="leading-10 mb-10">
                    <p className="font-DBAiry font-semibold Font-16-24">SIGN IN WITH</p>
                    <h2 className="font-36-64 font-DBAiry font-semibold">Passcode</h2>
                  </div>
                  <div className="md:px-12 px-10">
                    <InputForm
                      className="my-10"
                      title="Passcode"
                      type="text"
                      placeholder="Enter Passcode"
                      texterror="The passcode is not correct."
                    />
                    <ButtonLogin text="SIGN IN" />
                  </div>
                  <div className="md:px-12 px-10 mt-3 mb-4 pb-20">
                    <p className="ci-green">
                     Already have an account?  
                      <span className="text-white">
                        <Link  href="/login"><a> Sign in.</a></Link>
                      </span>
                    </p>
                  </div>
                  <div className="md:px-12 px-10 my-5 ">
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

export default Passcode;
