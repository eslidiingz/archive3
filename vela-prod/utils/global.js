export const unlimit =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export const ipfsToCdn = (link) => {
  var result = "";
  var explode = link.split("/ipfs/");
  if (explode[1]) {
    result = explode[1];
  }

  const url = "https://cdn.velaverse.io/hash/" + result;
  return url;
};
