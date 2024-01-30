import { useEffect, useState, useRef } from "react";
import { saveWhitelistUser } from "../../utils/api/whitelist-api";
import { getWalletAccount, web3 } from "../../utils/web3/init";
import { toast } from "react-toastify";
import { ToastDisplay } from "/components/ToastDisplay";
import Config from "../../utils/config";
import ButtonState from "../../components/button/button-state";
const RegistrationForm = () => {
  const [statusLoading, setStatusLoading] = useState({});
  const [portfolio, setPortfolio] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [about, setAbout] = useState("");
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const portfolioRef = useRef([]);
  // const [statusInput]
  const saveRegisterForm = async () => {
    firstNameRef.current.classList.remove("border-red-800");
    lastNameRef.current.classList.remove("border-red-800");
    const _data = {
      address: await getWalletAccount(),
      roles: "newbie",
      flag: "Y",
      register: {
        firstName,
        lastName,
        about,
        portfolio,
      },
    };

    const hasError = false;
    if (_data.register.portfolio.length < 1) {
      addPortfolio();
      hasError = true;
    }
    _data.register.portfolio.map((ele, index) => {
      portfolioRef.current[index].classList.remove("border-red-800");
      if (ele.value == "") {
        portfolioRef.current[index].classList.add("border-red-800");
        hasError = true;
      }
    });
    if (_data.register.firstName == "") {
      firstNameRef.current.classList.add("border-red-800");
      hasError = true;
    }
    if (_data.register.lastName == "") {
      lastNameRef.current.classList.add("border-red-800");
      hasError = true;
    }
    if (hasError) {
      toast(
        <ToastDisplay
          type="error"
          title="Failed"
          description={`Please complete the information.`}
        />
      );
      return;
    }

    await new web3.eth.sendTransaction({
      to: Config.ADMIN_WALLET,
      from: await getWalletAccount(),
      value: web3.utils.toWei(Config.REGISTER_FEE.toString(), "ether"),
    })
      .on("sending", function (hash) {
        setStatusLoading({
          loading: true,
        });
        toast(
          <ToastDisplay
            type={"process"}
            title={"Waiting For Confirmation"}
            description={"Confirm this transaction in your wallet"}
          />
        );
      })
      .on("transactionHash", (transaction) => {
        setStatusLoading({
          loading: true,
        });
        toast(
          <ToastDisplay
            type={"process"}
            title={"Your Transaction"}
            description={"View you transaction"}
            href={`${Config.BLOCK_EXPLORER}/tx/${transaction}`}
          />
        );
      })
      .on("receipt", async (receipt) => {
        setStatusLoading({
          loading: false,
        });

        <ToastDisplay
          type={"success"}
          title={"Approve Success"}
          description={"Approve Success"}
        />;

        if (receipt) {
          _data.register.portfolio.map((el, index) => {
            _data.register.portfolio[index]["value"] =
              "https://" + _data.register.portfolio[index]["value"];
          });
          const _result = await saveWhitelistUser(_data);
          if (_result.status === 201) {
            window.location = "/profile/mynft/";
          }
        }
      })
      .on("error", function (error) {
        console.log(error);
        setStatusLoading({
          loading: false,
        });
        toast(
          <ToastDisplay
            type={"error"}
            title={"Transaction rejected"}
            description={error.message}
          />
        );
      });

    return 0;
  };

  const handleValue = (e, index) => {
    const { name, value } = e.target;
    if (value.indexOf("https://") == 0 || value.indexOf("http://") == 0) {
      value = value.replace("https://", "");
      value = value.replace("http://", "");
    }
    const list = [...portfolio];
    list[index][name] = value;
    setPortfolio(list);
  };

  const addPortfolio = () => {
    setPortfolio((prev) => [
      ...prev,
      {
        value: "",
      },
    ]);
  };

  const removeInputPortfolio = (index) => {
    const list = [...portfolio];

    list.splice(index, 1);
    setPortfolio(list);
  };
  useEffect(() => {
    addPortfolio();
  }, []);
  return (
    <>
      <div className="heading">
        <h2>Register</h2>
        <p>Please register to become Velaverse Creator.</p>
      </div>
      <section className="vela-fluid">
        <div className="register-form">
          <div className="content">
            <div className="space-y-8 divide-y divide-gray-200">
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                  <label className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2">
                    <span className="text-red-800">*</span>First name
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      className="text-black max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      ref={firstNameRef}
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2">
                    <span className="text-red-800">*</span>Last name
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <input
                      className="text-black max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                      onChange={(e) => setLastName(e.target.value)}
                      type="text"
                      ref={lastNameRef}
                    />
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2"
                  >
                    About
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <textarea
                      onChange={(e) => setAbout(e.target.value)}
                      rows="3"
                      className="text-black max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                    ></textarea>

                    <p className="form-control max-w-lg mt-2">
                      Write a few sentences about yourself.
                    </p>
                  </div>
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-400 sm:mt-px sm:pt-2">
                    <span className="text-red-800">*</span>Portfolios
                    <span className="text-red-800">
                      <small> (minimum 1 row)</small>
                    </span>
                  </label>
                  <button
                    className="btn-theme btn-primary btn-sm mt-3"
                    text={"Add"}
                    onClick={() => addPortfolio()}
                  >
                    Add
                  </button>
                </div>

                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <div className="py-2 align-middle inline-block min-w-full mt-1">
                    <div className="border-b border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              No
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              URL
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {portfolio.length > 0 &&
                            portfolio.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-black">
                                    {index + 1}
                                  </td>

                                  <td className="px-6 py-4">
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm hidden md:flex">
                                        https://
                                      </span>

                                      <input
                                        className="text-black block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-none rounded-l-md rounded-r-md md:rounded-l-none"
                                        type="text"
                                        name="value"
                                        ref={(e) => {
                                          portfolioRef.current[index] = e;
                                        }}
                                        value={item.value}
                                        onChange={(e) => handleValue(e, index)}
                                        placeholder="www.velaverse.io"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      onClick={() =>
                                        removeInputPortfolio(index)
                                      }
                                      className="btn-theme btn-primary btn-sm"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                      {/* <table className="table-theme table-register">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>URL</th>
                            <th>
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.length > 0 &&
                            portfolio.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>

                                  <td>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                      <span className="bg-body inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-800 bg-gray-50 text-gray-500 sm:text-sm hidden md:flex">
                                        https://
                                      </span>

                                      <input
                                        className="bg-body text-white block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-800 rounded-none rounded-l-md rounded-r-md md:rounded-l-none"
                                        type="text"
                                        name="value"
                                        ref={(e) => {
                                          portfolioRef.current[index] = e;
                                        }}
                                        value={item.value}
                                        onChange={(e) => handleValue(e, index)}
                                        placeholder="www.velaverse.io"
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <button
                                      onClick={() => removeInputPortfolio(index)}
                                      className="btn btn-primary"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <div className="flex justify-between">
                  <ButtonState
                    onFunction={() => (window.location = "/profile/mynft")}
                    text={"Cancel"}
                    classStyle={"btn-theme btn-secondary"}
                  />

                  <ButtonState
                    onFunction={() => saveRegisterForm()}
                    text={"Save"}
                    loading={statusLoading.loading === true}
                    classStyle={"btn-primary"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegistrationForm;
