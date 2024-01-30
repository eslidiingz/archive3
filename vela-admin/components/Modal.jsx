import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"

export default function Modal(props) {
  var {
    type,
    title,
    background,
    border,
    children,
    buttonClose,
    backgroundClose,
    classStyle,
    buttonSubmit,
    buttonSubmitText,
    loading,
  } = props

  const [open, setOpen] = useState(false)

  loading = typeof loading !== "undefined" ? loading : false

  buttonSubmitText =
    typeof buttonSubmitText !== "undefined" ? buttonSubmitText : "ยืนยัน"

  backgroundClose = typeof backgroundClose === "undefined" ? true : false
  buttonClose = typeof buttonClose === "undefined" ? true : buttonClose
  classStyle =
    typeof classStyle === "undefined"
      ? "sm:max-w-sm sm:w-full pt-4 px-4 pb-20 sm:my-8 sm:p-6"
      : classStyle

  if (background === "dark") {
    background = `bg-[#141622]`
  } else if (background === "gray") {
    background = `bg-[#1e2226]`
  } else {
    background = `bg-white`
  }

  if (border === "gray") {
    border = `1px solid #40485d`
  } else {
    border = ``
  }

  var styleColor,
    styleIcon = null

  if (type === "success") {
    styleColor = "green"
    styleIcon = "check"
  } else if (type === "error") {
    styleColor = "red"
    styleIcon = "times"
  } else if (type === "info") {
    styleColor = "blue"
    styleIcon = "info"
  } else if (type === "warning") {
    styleColor = "yellow"
    styleIcon = "question"
  }

  const onCloseModal = (e) => {
    setOpen(false)
    props.onClosed && props.onClosed(e)
  }

  const onSubmitModal = (e) => {
    props.onSubmited && props.onSubmited(e)
  }

  const triggerClose = (e) => {
    if (backgroundClose == false) {
      e.preventDefault
    } else {
      if (buttonClose === false) {
        onCloseModal(e)
      } else {
        e.preventDefault
      }
    }
  }

  useEffect(() => {
    setOpen(props.open)
  }, [props])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto pt-6"
        onClose={(e) => triggerClose(e)}
      >
        <div className="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
          </Transition.Child>

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
            <div
              className={`relative inline-block ${background} rounded-md text-left overflow-hidden shadow-xl transform transition-all align-middle ${classStyle}`}
              style={{
                border: border,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.33)",
              }}
            >
              <div>
                {/* Icon type */}
                {typeof type !== "undefined" && (
                  <div
                    className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-${styleColor}-100`}
                  >
                    <i
                      className={`fa fa-${styleIcon} text-${styleColor}-600`}
                    ></i>
                  </div>
                )}
                {/* Title */}
                {typeof title !== "undefined" && (
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className={`text-lg leading-6 font-medium`}
                    >
                      <span className={`text-gray-800`}>{title}</span>
                    </Dialog.Title>
                    {/* <div
                    className={`text-${styleColor}-600 font-semibold text-lg`}
                  >
                    {title}
                  </div> */}
                  </div>
                )}
                {/* Content */}
                <div>
                  <p className="text-sm text-gray-500">{children}</p>
                </div>
              </div>

              <div className="flex justify-between pt-4 space-x-4">
                {typeof buttonSubmit !== "undefined" && (
                  <button
                    className="btn btn-primary w-full"
                    onClick={(e) => onSubmitModal(e)}
                  >
                    {loading && <i className="fa fa-spinner fa-spin mr-2"></i>}
                    {buttonSubmitText}
                  </button>
                )}

                {buttonClose === true && (
                  <button
                    type="button"
                    className="btn btn-secondary w-full"
                    onClick={() => onCloseModal()}
                  >
                    ปิด
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
