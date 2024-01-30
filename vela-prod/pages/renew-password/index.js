import InputForm from "../../components/form/InputLogin";
import ButtonLogin from "../../components/button/ButtonLogin";
import Link from 'next/link'

const Renew = () => {
  return (
    <>
      <section className="height-VH">
        <div className="img-bg-login h-full">
          <div className=" md:container px-4 mx-auto ">
            <div className="content-login">
              <div className="grid  lg:grid-cols-2 grid-cols-1 max-width-grid">
                <div className="relative ci-bg-login rounded-l-lg hidden lg:block">
                  <div className=" my-auto">
                      <img
                        className="w-full mx-auto rounded-l-lg"
                        src="/assets/image/Glob2.png"
                      />
                      <div className="absolute absolute-top-logo">
                        <img className="w-1/2" src="/assets/image/logo-green.png" />
                      </div>
                  </div>
                </div>
                <div className="text-center text-black ci-bg-green rounded-r-lg  lg:rounded-l-[0px] rounded-l-lg pt-10 pb-5 relative">
                  <div className="leading-10 mb-10">
                    <p className="font-DBAiry font-semibold Font-16-24">FORGET YOUR PASSWORD?</p>
                    <h2 className="font-36-50 font-DBAiry font-semibold">RENEW PASSWORD</h2>
                  </div>
                  <div className="md:px-12 px-10">
                    <InputForm
                      className="my-10"
                      title="Email"
                      type="text"
                      placeholder="Test@mail.com"
                      texterror="This email doesn't match a Velaverse account"
                    />
                    <ButtonLogin text="RENEW PASSWORD" />
                  </div>
              
                  <div className="md:px-12 px-10 mt-3 mb-10">
                   <p className="text-[#3B726A]">Enter your e-mail address and we’ll send you 
                    a link to reset your password, or back to <Link href="/login"><a className="text-white"> Sign in.</a></Link></p>
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

export default Renew;
