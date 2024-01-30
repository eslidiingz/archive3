import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { approveToken, getBalanceToken } from "../utils/web3/token";
import { convertWeiToEther } from "../utils/number";

export default function Modal(props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(props.open);
    checkBalance();
  }, [props]);

  const closeModal = (event) => {
    setOpen(false);
    props.onClosed && props.onClosed(event);
  };

  const checkBalance = async () => {
    let balance = convertWeiToEther(await getBalanceToken());
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-[100] inset-0 overflow-y-auto"
          onClose={(e) => {}}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div className="absolute top-2 right-3">
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-gray-400 hover:text-gray-500 cursor-pointer"
                    onClick={closeModal}
                  />
                </div>

                <div className="mt-4">{props.children}</div>

                {/* <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Payment successful
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Consequatur amet labore.
                    </p>
                  </div>
                </div>
              </div> 
              <div className="mt-5 sm:mt-6">
                <button
                  className="bg-gray-400 rounded text-white inline-flex justify-center w-full px-4 py-2 my-2 cursor-pointer"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
              */}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
