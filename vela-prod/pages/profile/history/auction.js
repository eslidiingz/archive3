import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Td from "../../../components/layouts/table-data";
import { cmBuilding, cmLand } from "../../../utils/checkApprove";
import Config from "../../../utils/config";
import ButtonState from "../../../components/button/button-state";
import {
  auctionContract,
  bidContract,
  getMetadata,
  getStrTokenSymbol,
  getWalletAccount,
} from "../../../utils/web3/init";
import { convertWeiToEther, numberFormat } from "../../../utils/number";
import { toast } from "react-toastify";
import { ToastDisplay } from "../../../components/ToastDisplay";

const BidHistoryList = () => {
  const router = useRouter();
  const [refundArray, setRefundArray] = useState([]);
  const [statusLoading, setStatusLoading] = useState({});
  const [pageLoading, setPageLoading] = useState(true);

  const fetchRefundHistory = async () => {
    const _length = await auctionContract.methods._marketIdCounter().call();

    let refundList = [];

    for (let i = 0; i < _length; i++) {
      const account = await getWalletAccount();
      const _market = await auctionContract.methods
        ._getItemInfo(parseInt(i))
        .call();
      const _refund = await bidContract.methods
        .getRefundData(i, account)
        .call();

      const allBid = await bidContract.methods.getAllBids(parseInt(i)).call();
      let winner;
      if (allBid.length > 0) {
        winner = await bidContract.methods._getBidWinner(parseInt(i)).call();
      }
      let contract = null;
      if (_market[1]._item.toLowerCase() === Config.LAND_ADDR.toLowerCase()) {
        contract = cmLand;
      } else if (
        _market[1]._item.toLowerCase() === Config.GENNFT_ADDR.toLowerCase()
      ) {
        contract = cmBuilding;
      } else {
        // console.log(_mar)
      }
      if(!contract) return [];

      const _uri = await contract.methods
        .tokenURI(parseInt(_market[1]._tokenId))
        .call();

      const _metadata = await getMetadata(_uri);

      const isOwnerItem =
        _market[1]._owner.toLowerCase() !== account.toLowerCase();
      const bidStatus = _refund.isBid === true && _refund.isRefund === false;
      const auctionStatus =
        _market[1]._status !== "0" ||
        _market[1]._expiration < Math.floor(new Date().getTime() / 1000);
      const winnerStatus =
        !winner &&
        winner._buyer.toLowerCase() !== account.toLowerCase() &&
        winner._isAccept;

      console.log(isOwnerItem && bidStatus && auctionStatus && winnerStatus);

      if (isOwnerItem && bidStatus && auctionStatus) {
        refundList.push({
          market: _market,
          refund: _refund,
          metadata: _metadata,
        });
      }
    }

    return refundList;
  };

  const ActionRefundBid = async (marketId, index) => {
    console.log(marketId);
    await bidContract.methods
      .refundBid(parseInt(marketId))
      .send({
        from: await getWalletAccount(),
      })
      .on("sending", function () {
        setStatusLoading({
          index: index,
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
          index: index,
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
      .on("receipt", function (receipt) {
        setStatusLoading({
          index: index,
          loading: false,
        });

        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Create cell item success !!!"}
            href={`${Config.BLOCK_EXPLORER}/tx/${receipt.transactionHash}`}
          />
        );

        fetchBidHistory();
      })
      .on("error", function (error) {
        setStatusLoading({
          index: index,
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
  };

  const fetchBidHistory = useCallback(() => {
    const fetchingData = async () => {
      const current = await fetchRefundHistory();

      setRefundArray(current);
      setPageLoading(false);
    };

    fetchingData();
  }, [router]);

  useEffect(() => {
    fetchBidHistory();
  }, [fetchBidHistory]);

  return (
    <>
      <div className="heading">
        <h2>Refund Bid History</h2>
      </div>
      <section className="vela-fluid">
        <div className="content">
          <div className="table-theme-warper">
            <table className="table-theme">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Refund ({getStrTokenSymbol()})</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pageLoading ? (
                  <tr>
                    <td colSpan="6" align="center">
                      Loading ...
                    </td>
                  </tr>
                ) : refundArray.length > 0 ? (
                  refundArray.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className="td-product-desc-lg">
                            <div className="img">
                              <img
                                className="img-table"
                                src={item.metadata.image_cdn}
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null;
                                  currentTarget.src =
                                    "/assets/image/no-image.jpg";
                                }}
                              />
                            </div>
                            <div className="desc">
                              <div>{item.metadata.name}</div>
                              <div>
                                Contract Address: {item.market[1]._item}
                              </div>
                              <div>
                                Token Id: {parseInt(item.market[1]._tokenId)}
                              </div>
                              <div>
                                Token Type:{" "}
                                {item.market[1]._itemType === "1"
                                  ? "ERC1155"
                                  : "ERC721"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {numberFormat(
                            convertWeiToEther(item.market[1]._refundPrice)
                          )}
                        </td>
                        <td>
                          <ButtonState
                            onFunction={() =>
                              ActionRefundBid(item.market[1]._marketId, index)
                            }
                            loading={
                              statusLoading.index === index &&
                              statusLoading.loading
                            }
                            text={"Refund"}
                            classStyle={
                              "btn-theme btn-primary btn-small ml-4 mr-0"
                            }
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-center" colSpan={3}>
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default BidHistoryList;
