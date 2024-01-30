import land from "../utils/abis/production/land.json";
import { useEffect, useState } from "react";
import { tokenContract } from "../utils/web3/init";
import { cmAssets } from "../utils/web3/nft";
import { map } from "lodash";

const Test = () => {
  const [totalSupply, setTotalSupply] = useState(0);
  const [items, setItems] = useState([]);

  const init = async () => {
    let total = await cmAssets.methods.totalSupply().call();

    setTotalSupply(total);

    var tokens = [];
    var items = [];

    for (let index = 0; index < total; index++) {
      tokens.push(parseInt(index));
    }

    let x = tokens.map(async (token) => {
      try {
        let uri = await getTokenUri(token);

        // console.log(`token ${token} :: ${uri}`);

        items.push({ token: token, uri: uri });
      } catch (error) {
        console.log(`e => ${token}`);
      }
    });

    let p = await Promise.all(x);

    console.log(`items :: ${items}`);
    console.log(`p :: ${p}`);

    setItems(items);
  };

  const getTokenUri = async (_tokenId) => {
    return await cmAssets.methods.tokenURI(_tokenId).call();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <table>
        {items.map((d) => {
          return (
            <>
              <tr>
                <td>{d.token}</td>
                <td>::</td>
                <td>{d.uri}</td>
              </tr>
            </>
          );
        })}
      </table>
    </>
  );
};

export default Test;
