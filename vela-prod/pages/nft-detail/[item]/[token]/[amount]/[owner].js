import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  auctionContract,
  bidContract,
  getMetadata,
  getWalletAccount,
  landContract,
  marketplaceContract,
  mintContract,
} from "../../../../../utils/web3/init";
import Config from "../../../../../utils/config";
import { toast } from "react-toastify";
import { ToastDisplay } from "../../../../../components/ToastDisplay";

const PlacementPage = () => {
  const router = useRouter();
  const { item, token, amount, owner } = router.query;

  const [pageLoading, setPageLoading] = useState(true);
  const [isTokenDeposit, setIsTokenDeposit] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [isBuilding, setIsBuilding] = useState(true);
  const [bundleURL, setBundleURL] = useState(null);
  const [nftDetail, setNftDetail] = useState({});

  const fetchPlacementItem = async (address, type, tokenId, amount, item) => {
    let data;
    let contract;

    if (address.toLowerCase() === Config.LAND_ADDR.toLowerCase()) {
      contract = landContract;
    } else if (address.toLowerCase() === Config.GENNFT_ADDR.toLowerCase()) {
      contract = mintContract;
    }

    if (type === "2") {
      const _data = await contract.methods.tokenURI(tokenId).call();
      const metadata = await getMetadata(_data);
      data = {
        amount,
        metadata,
        item,
        type: "ERC721",
      };
    }

    return data;
  };

  const fetchPlacementMarket = async () => {

    const tokenURI = await mintContract.methods.tokenURI(token).call();
    if (tokenURI) {
      const resTokenURI = await fetch(tokenURI);
      const assetDetail = await resTokenURI.json();
      console.log('asset detail', assetDetail)
      setNftDetail(assetDetail);
    }

    setPageLoading(false);
  };

  useEffect(() => {
    if (!router.isReady) return;
    fetchPlacementMarket();
  }, [router.isReady]);

  return (
    <>
      <section className="vela-fluid product-page">
        <div className="content">
          {pageLoading ? (
            <div className="loader-page" align="center">
              <svg
                className="animate-spin -ml-1 mr-3 h-16 w-16 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-10">
              <div className="col-span-2">
                <div className="product-img-cover">
                  <img src={nftDetail?.image_cdn || "/assets/image/no-image.jpg"} />
                </div>
              </div>
              <div className="col-span-2 lg:col-span-4">
                <div className="product-header">
                  <h2>{nftDetail.name || "-"}</h2>
                  <p className="owner-id">
                    Owner Wallet :
                    <span>{owner}</span>
                  </p>
                </div>
                <div className="product-accordion">
                  <div className="accordion">
                    <div className="accordion-item">
                      <div
                        className="accordion-header"
                        style={{ cursor: "pointer" }}
                      >
                        Detail
                      </div>
                      <div className="accordion-body">
                        <div label="Detail">
                          <div className="acc-detailtab">
                            <ul role="list">
                              <li>
                                <span className="name">Contract Address :</span>{" "}
                                {item}
                              </li>
                              <li>
                                <span className="name">Token ID :</span>{" "}
                                {token}
                              </li>
                              <li>
                                <span className="name">Qty : </span>
                                {amount}
                              </li>
                              {
                                isBuilding && (
                                  <li>
                                    <span className="name">Building size : </span>
                                    {nftDetail.attributes.size_x + " x " + nftDetail.attributes.size_x}
                                  </li>
                                )
                              }
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PlacementPage;
