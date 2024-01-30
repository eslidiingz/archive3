import { useEffect, useState } from "react";

// const url = "intent://APP_HOST/#Intent;scheme=APP_NAME;package=APP_PACKAGE;end";
// const url =
//   "intent://instagram.com/#Intent;scheme=https;package=com.instagram.android;end";
const androidUrl =
  "intent://io.metamask/#Intent;scheme=https;package=io.metamask;end";
const iosUrl = "metamask://https://apps.apple.com/us/app/metamask/id1438144202";

const Test = () => {
  const [device, setDevice] = useState();

  const android = () => {
    window.location.replace(androidUrl);
  };

  const ios = () => {
    window.location.replace(iosUrl);
  };

  useEffect(() => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setDevice("android");
    } else if (/Mobi|iPhone|iPad/i.test(navigator.userAgent)) {
      setDevice("ios");
    } else {
      setDevice("browser");
    }
  }, []);

  return (
    <>
      {device === "android" ? (
        <button onClick={android}>Open Metamask</button>
      ) : device === "ios" ? (
        <button onClick={ios}>Open Metamask</button>
      ) : (
        <a href="https://metamask.io/download/" target="_blank">
          Download Metamask
        </a>
      )}
    </>
  );
};

export default Test;
