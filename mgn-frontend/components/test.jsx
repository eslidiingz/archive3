import React, { useEffect, useState, useRef } from "react"
import Image from "next/image";

function Test() {
    const [tokenState, setTokenState] = useState(false);
    const [enteredTokenList, setEnteredTokenList] = useState([
        { tokenName: 'CNB', value: 0, imgSrc: "/assets/image/card/coin-cnb.svg", label: 'Your balance' },//0
        { tokenName: 'USDC', value: 0, imgSrc: "/assets/image/card/coin-usdc.svg", label: "Your balance" },//1
    ]);

    const onChangeToken = (e) => {
        setEnteredTokenList((prevState) => ([prevState[1], prevState[0]]));
        setTokenState(!tokenState)
    };

    const handleChangeTokenAmount = (e, index) => {
        setEnteredTokenList((prevState) => {
            const tempState = [...prevState];
            tempState[index].value = e.target.value;
            return tempState;
        });
    };

    return (
        <>
            <div className="w-full py-16">
                <div className="container mx-auto mt-8">
                    <div className="swap-section">
                        <div className="swap-right">
                            <div className="swap-box">
                                <div className="swap-box-body">
                                    <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-6">
                                        {enteredTokenList.map((tokenDetail, index) => (
                                            <>
                                                <div className="sm:col-span-6">
                                                    <label
                                                        htmlFor="street-address"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        {tokenDetail.tokenName}
                                                    </label>
                                                    <div className="mt-1">
                                                        <Image src={tokenDetail.imgSrc} width="30px" height="30px" />
                                                        <input
                                                            type="number"
                                                            className={`swap-input w-full ${index === 0 ? "f-token" : "sec-token"}`}
                                                            value={tokenDetail.value}
                                                            onChange={(e) => handleChangeTokenAmount(e, index)}
                                                        />
                                                        <small>{tokenDetail.label}</small>
                                                    </div>
                                                </div>
                                                {index === 0 && <button type="button">Switch</button> }
                                            </>
                                        ))}
                                        <div className="sm:col-span-6 flex justify-center pt-5">
                                            <a onClick={onChangeToken} className="swap-icon">
                                                <i className="fas fa-arrow-down"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Test
