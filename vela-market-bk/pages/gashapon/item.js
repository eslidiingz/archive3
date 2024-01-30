import Link from "next/link";
import { useState, useEffect } from "react";
import Web3 from "web3";
import token from "/utils/abis/token.json";
import nft from "/utils/abis/item.json";
import Config from "/utils/config.json";
import { toast } from "react-toastify";
import { ToastDisplay } from "../../components/ToastDisplay";
import { Transition } from "@tailwindui/react";
import CollectionModal from "/components/CollectionModal";
import RewardModal from "/components/RewardModal";
import { getTokenSymbol } from "../../utils/web3/init";
import { unlimit } from "../../utils/global";
import ButtonState from "../../components/button/button-state";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const GashaponItem = () => {
  const [count, setCount] = useState(1);
  const [showCollection, setShowCollection] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [collectionReward, setCollectionReward] = useState([]);
  const [userState, setUserState] = useState({
    state: "not-available",
    text: "Not Available",
    loading: false,
  });

  const showCollectionModal = (e) => {
    setShowCollection(!showCollection);
  };

  const showRewardModal = (e) => {
    setShowReward(!showReward);
  };

  const transferMysteryBox = async () => {
    const accounts = await web3.eth.getAccounts();
    // ABI สำหรับ MultiToken
    const nftContract = new web3.eth.Contract(nft, Config.ItemAddress);

    await nftContract.methods
      .transferItemFromBox(count)
      .send({ from: accounts[0] })
      .on("sending", () => {
        setUserState({
          text: "OPEN NOW !!!",
          state: "approve",
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
      .on("transactionHash", (res) => {
        setUserState({
          text: "OPEN NOW !!!",
          state: "approve",
          loading: true,
        });

        toast(
          <ToastDisplay
            type={"process"}
            title={"Your Transaction"}
            description={"View on etherscan.io"}
            href={`${Config.blockExplorer}/tx/${res}`}
          />
        );
      })
      .on("receipt", (result) => {
        console.log(result);
        setCollectionReward(
          result.events.statusTransfer.returnValues.resultRandom
        );

        setUserState({
          text: "OPEN NOW !!!",
          state: "approve",
          loading: false,
        });
        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Open mystery box success !!!"}
            href={`${Config.blockExplorer}/tx/${result.transactionHash}`}
          />
        );
        showRewardModal();
      })
      .on("error", (error) => {
        setUserState({
          text: "OPEN NOW !!!",
          state: "approve",
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

  const checkBalanceToken = async () => {
    const accounts = await web3.eth.getAccounts();
    // ABI สำหรับ MultiToken
    const tokenContract = new web3.eth.Contract(token, Config.TokenAddress);
    //check balance of in wallet address

    const tokenBalance = await tokenContract.methods
      .balanceOf(accounts[0])
      .call();
    const balance = web3.utils.fromWei(tokenBalance, "ether");

    if (parseFloat(balance) < Config.basePrice) {
      setUserState({
        text: `Not Have ${await getTokenSymbol()}`,
        state: "not-enough",
      });
    } else {
      //check allowance from wallet
      const tokenAllowance = await tokenContract.methods
        .allowance(accounts[0], Config.ItemAddress)
        .call();

      //if allowance not allocate then approve token
      if (tokenAllowance <= 0) {
        setUserState({
          text: "approve",
          state: "unapprove",
        });
      } else {
        setUserState({
          text: "OPEN NOW !!!",
          state: "approve",
        });
      }
    }
  };

  const initialize = async () => {
    const nftContract = new web3.eth.Contract(nft, Config.ItemAddress);

    const totalAvailbleBox = await nftContract.methods
      .availableBoxTotal()
      .call();
    if (totalAvailbleBox > 0) {
      checkBalanceToken();
    } else {
      setUserState({
        state: "not-available",
        text: "Not Available",
        loading: false,
      });
    }
  };

  const approveAllowanace = async () => {
    const accounts = await web3.eth.getAccounts();
    // ABI สำหรับ MultiToken
    const tokenContract = new web3.eth.Contract(token, Config.TokenAddress);

    await tokenContract.methods
      .approve(Config.ItemAddress, unlimit)
      .send({ from: accounts[0] })
      .on("sending", () => {
        setUserState({
          text: "approve",
          state: "unapprove",
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
      .on("receipt", () => {
        setUserState({
          text: "OPEN NOW !!!",
          state: "approve",
          loading: false,
        });

        toast(
          <ToastDisplay
            type={"success"}
            title={"Transaction reciept"}
            description={"Approve Success !!!"}
          />
        );
      })
      .on("error", (error) => {
        setUserState({
          text: "approve",
          state: "unapprove",
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

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <div className="content">
        <h1 className="title">Item Gashapon Box</h1>
      </div>

      <div className="flex justify-center text-center">
        <div>
          <label htmlFor="amount" className="block">
            Amount
          </label>
          <input
            type="number"
            min="0"
            max="5"
            id="amount"
            className="w-32 text-center"
            required
            onChange={(e) => setCount(e.target.value)}
          />

          {userState.state !== "not-available" && (
            <div className="bg-white px-4 pl-0 py-2 uppercase text-center flex">
              {/* <div className="transform -rotate-90">{Config.baseToken}</div>
              <div className="text-2xl">{balance}</div> */}
            </div>
          )}

          {userState.state === "not-enough" && (
            <ButtonState
              text={userState.text}
              classStyle={
                "py-4 font-medium text-xl py-4 bg-red-200 text-red-600 px-4 rounded"
              }
            />
          )}

          {userState.state === "not-available" && (
            <ButtonState
              text={userState.text}
              classStyle={
                "py-4 font-medium text-xl bg-red-200 text-red-600 px-4 rounded"
              }
            />
          )}
          {userState.state === "unapprove" && (
            <ButtonState
              onFunction={() => approveAllowanace()}
              text={userState.text}
              loading={userState.loading}
              classStyle={
                "py-4 font-medium text-xl bg-gray-400 text-white px-4 rounded"
              }
            />
          )}
          {userState.state === "approve" && (
            <ButtonState
              onFunction={() => transferMysteryBox()}
              text={userState.text}
              loading={userState.loading}
              classStyle={
                "py-4 font-medium text-xl bg-yellow-400 text-red-600 px-4 rounded"
              }
            />
          )}
        </div>
      </div>

      <Transition
        show={showCollection}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <CollectionModal onClose={showCollectionModal} show={showCollection} />
      </Transition>

      <Transition
        show={showReward}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <RewardModal
          onClose={showRewardModal}
          show={showReward}
          collection={collectionReward}
          count={count}
        />
      </Transition>
    </>
  );
};

export default GashaponItem;
