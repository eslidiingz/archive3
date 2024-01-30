import Link from "next/link";
import { Component, useState, useEffect } from "react";
import Web3 from "web3";
import token from "/utils/abis/token.json";
import nft from "/utils/abis/avatar.json";
import Config from "/utils/config.json";
import { toast } from "react-toastify";
import { ToastDisplay } from "../../components/ToastDisplay";
import { Transition } from "@tailwindui/react";
import CollectionModal from "/components/CollectionModal";
import RewardModal from "/components/RewardAvatarModal";
import { unlimit } from "../../utils/global";
import ButtonState from "../../components/button/button-state";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const GashaponAvatar = () => {
  const [count, setCount] = useState(1);
  const [balance, setBalance] = useState(Config.basePrice);
  const [showCollection, setShowCollection] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [collectionReward, setCollectionReward] = useState([]);
  const [approved, setApproved] = useState(false);
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

  const randomShuffle = async (data) => {
    const _res = await fetch(Config.shuffleURI, {
      method: "POST",
      headers: {
        "Content-Type": "application/javascript",
      },
      body: JSON.stringify(data),
    });

    const _json = await _res.json();
    console.log(_json);
  };

  const transferMysteryBox = async (e) => {
    // e.preventDefault();

    const accounts = await web3.eth.getAccounts();
    // ABI สำหรับ MultiToken
    const nftContract = new web3.eth.Contract(nft, Config.AvatarAddress);

    const balance = await nftContract.methods
      .balanceOf(Config.AvatarAddress)
      .call();

    var _collection = [];

    for (let i = 0; i < balance; i++) {
      const tokenId = await nftContract.methods
        .tokenOfOwnerByIndex(Config.AvatarAddress, i)
        .call();

      _collection.push(tokenId);
    }
    let tokenIdList = [];

    let tokenId = _collection[Math.floor(Math.random() * _collection.length)];

    tokenIdList.push(tokenId);

    await nftContract.methods
      .transferItem(tokenId)
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
        setCollectionReward(tokenIdList);

        // setCollectionReward(
        //   result.events.statusTransfer.returnValues.resultRandom
        // );

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
    if (parseFloat(balance) < balance) {
      setUserState({
        text: "Not Have EPIC",
        state: "not-enough",
      });
    } else {
      //check allowance from wallet
      const tokenAllowance = await tokenContract.methods
        .allowance(accounts[0], Config.AvatarAddress)
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
    const nftContract = new web3.eth.Contract(nft, Config.AvatarAddress);

    const totalAvailbleBox = await nftContract.methods
      .balanceOf(Config.AvatarAddress)
      .call();

    if (totalAvailbleBox > 0) {
      checkBalanceToken();
    } else {
      setUserState({
        state: "not-availiable",
        text: "Not Availiable",
        loading: false,
      });
    }
  };

  const approveAllowanace = async () => {
    const accounts = await web3.eth.getAccounts();
    // ABI สำหรับ MultiToken
    const tokenContract = new web3.eth.Contract(token, Config.TokenAddress);

    await tokenContract.methods
      .approve(Config.AvatarAddress, unlimit)
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
  });

  const handleClick = async () => {
    // const _r = await randomShuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // console.log(_r);

    // return 0;

    const _arrItem = [6];

    setCollectionReward(_arrItem);

    const getMetadata = async (tokenId) => {
      const nftContract = new web3.eth.Contract(nft, Config.AvatarAddress);
      const _tokenUri = await nftContract.methods.tokenURI(tokenId).call();

      const _res = await fetch(_tokenUri);
      const _json = await _res.json();
      return _json;
    };

    const _data = _arrItem.map(async (item) => {
      const _id = item;
      const _count = 1;
      const _metadata = await getMetadata(item);
      // const _id = await _index(item);
      // const _count = await _item(item);
      // const _metadata = await this.getCollectionMetadata(_collectionUrl, _id);

      return [_id, _count, _metadata];
    });

    const _collection = await Promise.all(_data);

    setShowReward(true);

    // console.log("click");

    // const nftContract = new web3.eth.Contract(nft, Config.AvatarAddress);
    // const _tokenUri = await nftContract.methods.tokenURI(20).call();
    // const _res = await fetch(_tokenUri);
    // const _json = await _res.json();
    // const _image = _json.image;
  };

  return (
    <>
      <div className="content">
        <h1 className="title">Avatar Gashapon Box</h1>
      </div>

      {/* <button onClick={(e) => handleClick()}>Click</button> */}

      <div className="flex justify-center text-center">
        <div>
          {/* <label htmlFor="amount" className="block">
            Amount
          </label>
          <input
            type="number"
            min="0"
            max="5"
            id="amount"
            className="w-32 text-center"
            value="1"
            disabled
            required
          /> */}

          {userState.state !== "not-availiable" && (
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

          {userState.state === "not-availiable" && (
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

export default GashaponAvatar;
