function Error({ statusCode }) {
  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: "100" }}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="ModalChainIdCurrent"
    >
      <div
        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 mx-auto"
        style={{ maxWidth: "1200px" }}
      >
        <div className="max-screen-theme mx-auto py-16 px-4 sm:py-24 sm:px-6 md:py lg:px-0 lg:flex lg:justify-between flex flex-col lg:flex-row relative">
          <div className="max-w-xl flex flex-col justify-center px-5 sm:px-10 lg:px-0 mx-auto mb-8 lg:mb-0">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white sm:text-4xl sm:tracking-tight lg:text-5xl header-text-market lg:mb-4 ">
              VELAVERSE
            </h2>
            <p className="mt-5 mb-5 text-xl header-text-market2">
              Item Not Found
              <br />
            </p>
            <div className="flex flex-row  mt-5 items-center">
              <button
                className="btn-header mx-auto lg:w-40"
                onClick={() => (window.location = "/market")}
              >
                Go to Home
              </button>
              {/* <button
              className="btn-header"
              onClick={() => (window.location = "/profile/mynft")}
            >
              Create{" "}
            </button> */}
            </div>
          </div>
          {/* <div className="mt-10 w-full max-w-xs mx-auto"> */}
          <div className="homme2">
            <img
              src={"/assets/image/items/land-2.png"}
              alt=""
              className="m-auto"
              width="80%"
            />
            {/* <div className="cloud2"> */}
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud1"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud2"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud3"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud4"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud5"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud6"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud7"
            />
            <img
              src={"/assets/image/items/cloud.png"}
              alt=""
              className="cloud8"
            />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
