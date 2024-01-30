const hasWeb3 = () => {
  if (typeof window === "undefined") return false;
  return typeof window.ethereum !== "undefined";
};

module.exports = hasWeb3;
