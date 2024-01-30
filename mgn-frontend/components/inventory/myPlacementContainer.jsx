import { memo, useState } from "react";

import Spinner from "../Spinner";
import CardAsset from "../card/CardAsset";

const MyPlacementContainer = ({ myPlacements = [], loading = true }) => {
    console.log({myPlacements})
    return (
        <>
            {loading && <Spinner showText={false} size={'lg'} />}
            {!loading && myPlacements.length < 1 && <h4 className="text-center my-2">Placement Not Found.</h4>}
            {!loading && Array.isArray(myPlacements) && myPlacements.map((placement, index) => (
                <div
                    className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 my-2"
                    key={index}
                >
                    <CardAsset 
                        showUseButton={false}
                        data={placement} 
                        classname="col-6 px-2"
                        className="d-none"
                        UseButton="Use"
                        UseTittle="Hello"
                        UseImg="/assets/image/card/cannabis.webp"
                        UseDetailmain="Your Plant is grown up!"
                        Useinfomation="Your cannabis plant is fully grown and can be use to increase price Get more 15% of the value and sell it back to us with CNB tokens."
                        UseInputname02="Started Price"
                        UserInputname03="Sell Back Price (+ 15%)"
                        UserTextprice="1 CNB = 1.254 USDC"
                        img="/assets/image/card/cannabis.webp"
                        typecoin="300 USDC"
                        ready={index % 2 === 0 ? true : false}
                        SellButton="Sell"
                        SellTittle="Sell"
                        SellImg="/assets/image/card/cannabis.webp"
                        SellInputname01="Asset ID"
                        SellInputname02="Started Price"
                        SellInputname03="Sell Price"
                    />
                </div>
            ))}
        </>
    );
};

export default memo(MyPlacementContainer);
