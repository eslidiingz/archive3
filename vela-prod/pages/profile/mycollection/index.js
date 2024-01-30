import Link from "next/link";
import Config from "../../../utils/config";
import { useEffect, useState } from "react";
import CardCollection from "../../../components/collections/card-collection";
import { fetchUserData } from "../../../utils/api/account-api";
import { fetchWhitelistUser } from "../../../utils/api/whitelist-api";
import { getWalletAccount } from "../../../utils/web3/init";
import Accordion from "/components/Accordion";

const mouseUp = (name) => {
  document.querySelector("#sidebar-toggle").classList.toggle("hide");
};

const MyCollectionPage = () => {
  const [allList, setAllList] = useState([]);
  const [roles, setRoles] = useState("");
  const [loading, setLoading] = useState(false);
  const checkWalletWhitelist = async () => {
    const _account = await getWalletAccount();
    const { rows } = await fetchWhitelistUser(_account);

    // const _whitelist = await fetch(`${Config.COLLECTION_API}/whitelists`);
    // const { rows } = await _whitelist.json();

    // const _result = await rows.filter((item) => {
    //   return item.address.toLowerCase() === _account.toLowerCase();
    // });

    let userWhitelist = {};

    if (rows.length > 0) {
      userWhitelist = rows[0];
    }

    // console.log("userWhitelist", userWhitelist);

    // const _r = await Promise.all(_result);
    // var data = {};

    // data.users = userWhitelist
    // data.roles = userWhitelist.roles;

    setRoles(userWhitelist);
  };

  const fetchAllCollection = async () => {
    setLoading(true);
    const data = await fetchUserData(await getWalletAccount());
    const account = data.rows[0]._id;
    const url = "collections";
    const endpoint = `${Config.COLLECTION_API}/${url}`;
    const item = await fetch(`${endpoint}?owner=${account}`);
    const { rows } = await item.json();
    if (allList.length === 0) {
      setAllList(rows);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    checkWalletWhitelist();
    fetchAllCollection();
  }, []);
  return (
    <>
      <div className="heading">
        <h2>My Collections</h2>
        <p>
          Here you can search and buy creator&apos;s ASSETS with Class to
          incorporate them into your LAND
        </p>

        {roles &&
          roles.flag === "Y" &&
          roles.roles !== "" &&
          roles.roles === "minter" && (
            <Link href={"/profile/mycollection/create"}>
              <button className="btn btn-primary btn-lg mt-4">
                Create My Collection
              </button>
            </Link>
          )}
      </div>
      {allList.length == 0 && !loading && (
          <div className="text-center mt-2">
            <br></br>
            <h2><i>No data</i></h2>
          </div>
        )}
      <section className="vela-full-sidebar" id="sidebar-toggle">
        <div className="content">
          <div className="card-collection-fullwidth">
            {allList.map((item, index) => {
              return (
                <div key={index.toString()}>
                  <Link href={`/collection/${item._id}`}>
                    <CardCollection meta={item} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default MyCollectionPage;
