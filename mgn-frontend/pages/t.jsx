import React, { useEffect, useState, useRef } from "react"

function Test() {
    const [tokenState, setTokenState] = useState(false);
    const [enteredTokenList, setEnteredTokenList] = useState([
        { tokenName: 'BUSD', value: 0 },//0
        { tokenName: 'MGN', value: 0 },//1
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
                                            <div className="sm:col-span-6">
                                                <label
                                                    htmlFor="street-address"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {tokenDetail.tokenName}
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="number"
                                                        className="swap-input w-full"
                                                        value={tokenDetail.value}
                                                        onChange={(e) => handleChangeTokenAmount(e, index)}
                                                    />
                                                </div>
                                            </div>
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