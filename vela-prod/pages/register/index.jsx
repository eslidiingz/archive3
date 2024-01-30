import InputForm from "../../components/form/InputLogin";
import ButtonLogin from "../../components/button/ButtonLogin";
import Link from "next/link";
import { useEffect, useState } from "react";
import PainLayout from "../../components/layouts/painLayout";
import { getWalletAccount } from "../../utils/web3/init";
import { saveRegister } from "../../utils/api/register-api";
import { toast } from "react-toastify";
import { ToastDisplay } from "../../components/ToastDisplay";
import Router from "next/router";

const RegisterWeb = () => {
  const [formRegister, setFormRegister] = useState({
    username: "",
    password: "",
    confirm_password: "",
    email: "",
    confirm_email: ""
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirm_password: "",
    email: "",
    confirm_email: ""
  });

  const handleRegister = async () => {
    const validated = validateForm();
    if (!validated) {
      // toast(
      //   <ToastDisplay
      //     type="warning"
      //     title="Warning"
      //     description="Please check your register form."
      //   />
      //   , { autoClose: 4000 });
      return;
    }

    const walletAddress = await getWalletAccount();

    if (!errors.confirm_password && walletAddress) {
      const reqBody = { ...formRegister, walletAddress };

      const register = await saveRegister(reqBody);

      if (register.error) {
        toast(
          <ToastDisplay
            type="warning"
            title="Warning"
            description={register?.error?.message || 'Failed to register.'}
          />
          , { autoClose: 4000 });
      } else {
        handleResetFormRegister();
        toast(
          <ToastDisplay
            type="success"
            title="Success"
            description={register.message}
          />
          , {
            autoClose: 4000,
            onClose: handleCloseNotification,
            onClick: handleCloseNotification
          });
      }
    }
  };

  const handleCloseNotification = () => {
    Router.push('/market');
  }

  const handleResetFormRegister = () => {
    setFormRegister({
      username: "",
      password: "",
      confirm_password: "",
      email: "",
      confirm_email: ""
    });
  };

  const handleInputChange = (e) => {
    setFormRegister((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  const validateEmail = (enteredEmail) => {
    try {
      const mailFormat = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.){1,2}[a-zA-Z]{2,}))$/);
      return mailFormat.test(enteredEmail);
    } catch (err) {
      return false;
    }
  };

  const validatePassword = () => {
    let validated = true;

    const passwordCriteria = {
      oneUpperCase: true,
      oneLowerCase: true,
      oneNumber: true,
      characterLength: true
    };

    const errorMessageObj = {
      password: [],
      confirm_password: ""
    }

    const enteredPassword = formRegister.password.trim();
    const enteredPasswordConfirmation = formRegister.confirm_password.trim();

    try {
      if (
        enteredPassword &&
        enteredPasswordConfirmation &&
        enteredPassword != enteredPasswordConfirmation
      ) {
        validated = false;
        errorMessageObj.password = "Password confirmation doesn't match";
      } else {
        if (!enteredPassword) {
          validated = false;
          errorMessageObj.password.push("Password needed");
        } else {

          const oneLowerCase = new RegExp("^(?=.*[a-z])");
          const oneUpperCase = new RegExp("^(?=.*[A-Z])");
          const oneNumber = new RegExp("^(?=.*[0-9])");

          if(!oneLowerCase.test(enteredPassword)){
            validated = false;
            passwordCriteria.oneLowerCase = false;
          }

          if(!oneUpperCase.test(enteredPassword)){
            validated = false;
            passwordCriteria.oneUpperCase = false;
          }

          if(!oneNumber.test(enteredPassword)){
            validated = false;
            passwordCriteria.oneNumber = false;
          }

          if(enteredPassword?.toString?.()?.length < 8){
            validated = false;
            passwordCriteria.characterLength = false;
          }

          if(!passwordCriteria.oneLowerCase && (passwordCriteria.oneUpperCase && passwordCriteria.oneNumber)){
            validated = false;
            errorMessageObj.password.push("Password must contained at least 1 Lower Case");
          }

          if(!passwordCriteria.oneUpperCase && (passwordCriteria.oneLowerCase && passwordCriteria.oneNumber)){
            validated = false;
            errorMessageObj.password.push("Password must contained at least 1 Upper Case");
          }

          if(!passwordCriteria.oneNumber && (passwordCriteria.oneLowerCase && passwordCriteria.oneUpperCase)){
            validated = false;
            errorMessageObj.password.push("Password must contained at least 1 Number");
          }

          if(!passwordCriteria.oneLowerCase && !passwordCriteria.oneUpperCase){
            validated = false;
            errorMessageObj.password.push("Password must contained at least 1 Upper Case and 1 Lower Case");
          } 

          if(!passwordCriteria.oneLowerCase && !passwordCriteria.oneNumber){
            validated = false;
            errorMessageObj.password.push("Password must contained at least 1 Lower Case and 1 Number");
          }

          if(!passwordCriteria.oneUpperCase && !passwordCriteria.oneNumber){
            validated = false;
            errorMessageObj.password.push("Password must contained at least 1 Upper Case and 1 Number");
          }

          if(!passwordCriteria.characterLength){
            validated = false;
            errorMessageObj.password.push("Password must have at least 8 characters");
          }

          errorMessageObj.password = errorMessageObj.password.join(', ');
        }
      }

      return {validated, errorMessageObj};

    } catch {
      return {validated: false, errorMessageObj};
    }
  };

  const validateForm = () => {
    let validated = true;
    let isValidEmail = false;
    let errorMessageObj = {
      username: "",
      password: "",
      confirm_password: "",
      email: "",
      confirm_email: ""
    }

    // Validate an email
    if (formRegister.email?.trim() && formRegister.email?.trim()) {
      if (formRegister.email.trim().length > 50) {
        validated = false;
        errorMessageObj.email = "Your email length exceeds 50 characters";
      } else {
        isValidEmail = validateEmail(formRegister.email.trim());
        validated = isValidEmail;
        errorMessageObj.email = isValidEmail ? "" : "Invalid email format";
      }
    }

    if(!formRegister.email?.trim()){
      validated = false;
      errorMessageObj.email = "Email needed";
    } 

    if(!formRegister.confirm_email?.trim()){
      validated = false;
      errorMessageObj.confirm_email = "Email confirmation needed";
    }

    if(formRegister.email?.trim() && formRegister.confirm_email?.trim() && (formRegister.email?.trim() !== formRegister.confirm_email?.trim())){
      validated = false;
      errorMessageObj.email = "";
      errorMessageObj.confirm_email = "Email confirmation doesn't match.";
    }

    // Validate username empty or not
    if (!formRegister.username.trim()) {
      validated = false;
      errorMessageObj.username = "Username needed";
    } else if (formRegister.username.trim().length > 50) {
      validated = false;
      errorMessageObj.username = "Your username length exceeds 50 characters";
    }

    // Validate password & comfirm password empty or not
    const validatedPassword = validatePassword();

    if(!validatedPassword.validated) validated = validatedPassword.validated;

    errorMessageObj = { ...errorMessageObj, ...validatedPassword.errorMessageObj };

    setErrors(errorMessageObj);

    console.log('validated',validated)

    return validated;
  };

  const initialize = async () => {
    let wallet_address = await getWalletAccount();

    // console.log("wallet account: ", wallet_address);
  };

  // useEffect(() => {
  //   initialize();
  // }, []);

  return (
    <>
      <PainLayout>
        <section className="height-VH">
          <div className="img-bg-login h-full">
            <div className=" md:container px-4 mx-auto ">
              <div className="content-login">
                <div className="grid lg:grid-cols-2 grid-cols-1 max-width-grid">
                  <div className="relative ci-bg-login rounded-l-lg hidden lg:block">
                    <img
                      className="w-full mx-auto rounded-l-lg absolute innrt-bg-login"
                      src="/assets/image/Glob2.png"
                    />
                    <div className="absolute absolute-top-logo">
                      <img
                        className="w-1/2"
                        src="/assets/image/logo-green.png"
                      />
                    </div>
                  </div>
                  <div className="text-black ci-bg-green rounded-r-lg  lg:rounded-l-[0px] rounded-l-lg py-10 relative">
                    <div className="px-10 justify-end flex pb-10">
                      <span className="btn-client btn cursor-default">Client version</span>
                    </div>
                    <div className="px-12 flex items-center	">
                      <h3 className="text-start f-25 text-uppercase font-DBAiry ">REGISTER for Velaverse</h3>
                      <div className="display-set">
                        <img className="w-32 pl-1 " src="/assets/image/icons/line-register.png" />
                      </div>
                    </div>
                    <div className="md:px-12 px-10">
                      {/* <InputForm
                      className="my-10"
                      title="Username"
                      type="text"
                      placeholder="Enter username"
                    /> */}

                      <div className="grid gap-1 font-DBAiry">
                        <div className="text-left my-3">
                          <div className="input-register-wrapper w-full bg-[#384753] rounded-md ">
                            <input
                              className={`text-white font-semibold w-full Font-16-24 ${errors.username ? 'is-invalid' : ''}`}
                              type="text"
                              name="username"
                              placeholder="username"
                              value={formRegister.username}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                          <span className="ci-red">{errors.username}</span>
                        </div>
                      </div>

                      {/* <InputForm
                      className="my-10"
                      title="Password"
                      type="password"
                      placeholder="Enter username"
                      texterror="This email doesn't match a Velaverse account"
                    /> */}

                      <div className="grid gap-1 font-DBAiry">
                        <div className="text-left">
                          <div className="input-register-wrapper w-full bg-[#384753] rounded-md">
                            <input
                              className={`text-white font-semibold w-full Font-16-24 ${errors.password ? 'is-invalid' : ''}`}
                              type="password"
                              name="password"
                              placeholder="password"
                              value={formRegister.password}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-1 font-DBAiry">
                        <div className="text-left  my-3">
                          <div className="input-register-wrapper w-full bg-[#384753] rounded-md">
                            <input
                              className={`text-white font-semibold w-full Font-16-24 ${errors.password ? 'is-invalid' : ''}`}
                              type="password"
                              name="confirm_password"
                              placeholder="confirm password"
                              value={formRegister.confirm_password}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                          <span className="ci-red">{errors.password}</span>
                          {/* {errors.confirm_password && (
                            <small className="text-[#C84850]  Font-14-16">
                              {errors.confirm_password}
                            </small>
                          )} */}
                        </div>
                      </div>

                      {/* <InputForm
                      className="my-10"
                      title="Email"
                      type="text"
                      placeholder="Test@mail.com"
                    /> */}

                      <div className="grid gap-1 font-DBAiry">
                        <div className="text-left mb-3">
                          <div className="input-register-wrapper w-full bg-[#384753] rounded-md">
                            <input
                              className={`text-white font-semibold w-full Font-16-24 ${errors.email ? 'is-invalid' : ''}`}
                              type="email"
                              name="email"
                              placeholder="email"
                              value={formRegister.email}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                          {/* <span className="ci-red">{errors.email}</span> */}
                        </div>
                      </div>

                      <div className="grid gap-1 font-DBAiry">
                        <div className="text-left">
                          <div className="input-register-wrapper w-full bg-[#384753] rounded-md">
                            <input
                              className={`text-white font-semibold w-full Font-16-24 ${errors.confirm_email ? 'is-invalid' : ''}`}
                              type="email"
                              name="confirm_email"
                              placeholder="Confirm Email"
                              value={formRegister.confirm_email}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                          <span className="ci-red">{errors.email || errors.confirm_email || ''}</span>
                        </div>
                      </div>

                      {/* <ButtonLogin text="REGISTER" /> */}
                      <button
                        onClick={(e) => handleRegister()}
                        className="p-2 lg:p-0  w-full btn-login rounded-lg mt-10 padding-btn-rg uppercase text-black font-bold font-DBAiry  Font-14-16"
                      >
                        REGISTER
                      </button>
                    </div>
                    <div className="md:px-12 px-10 mt-3 mb-4  text-center">
                      <small className="ci-green f-12">
                        This Registeration account must be use in Velaverse Client version.
                      </small>
                    </div>
                  </div>
                  {/* <div className="col-span-full flex justify-center py-2 hidden lg:block">
                    <div className="oval mx-auto"></div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </PainLayout>
    </>
  );
};

export default RegisterWeb;
