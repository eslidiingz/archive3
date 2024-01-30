// import { useState, useEffect } from "react";

// import Link from "next/link";
// import {
//     getBalanceToken,
//     getTokenSymbol,
//     checkTokenAllowance,
//     approveToken,
//     revokeAllowance,
// }  from "../../utils/web3/token";
// import Modal from '../../components/Modal';
// import Land from '../../utils/land/map2.json';
// import { convertEthToWei, convertWeiToEther } from "../../utils/number";
// import { getPricePerLand } from "../../utils/web3/factory";
// import ButtonState from "/components/button/button-state";
// const MainLand = () => {
//     const [mapData, setMap] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [size, setSize] = useState(10);
//     const [openModal, setOpenModal] = useState(false);
//     const [modalContent, setModalContent] = useState({
//         status: "token-enough",
//         body: "Buy Land",
//         state: "not-approve-token",
//       });
//     const onModalClosed = () => {
//         setOpenModal(false);
//     };
//     const onApproveToken = async () => {
//         setLoading(true);
//         let approved = await approveToken();
//         console.log(approved);
//         setLoading(false);
//     };
//     const formatArray = () => {
//       setLoading(true);
//       let newArr = [];
//       Land.map((ele, index) => {
//         if(!newArr[199 -ele.y]) newArr[199 - ele.y] = [];
//         newArr[199 - ele.y][ele.x]= ele;
//       });
//       setMap(newArr);
//       console.log(newArr);
//       setLoading(false);
//     }
//     const buyLand = async (data) => {
//         console.log("mint LAND \nx: " + data.x + "\ny: " + data.y);
    
//         let balance = await getBalanceToken();
//         let pricePerLand = await getPricePerLand();
    
//         let symbol = await getTokenSymbol();
    
//         if (balance < convertEthToWei(pricePerLand)) {
//           setModalContent({
//             status: "token-not-enough",
//             body: `${symbol} token not enough.`,
//             // state: "not-approve-token",
//           });
    
//           setOpenModal(true);
//           return;
//         }
    
//         let allowance = await checkTokenAllowance();
    
//         if (allowance <= 0) {
//           setModalContent((prevState) => ({
//             ...prevState,
//             state: "not-approve-token",
//           }));
    
//           // let approved = await approveToken();
    
//           // console.log(approved);
//         }
    
//         setOpenModal(true);
//       };
//     useEffect(() => {
//       formatArray();
//     }, []);
//     return (
//       <div>
//         <input type="number" value={size} step="10" onChange={(e) => setSize(e.target.value)} />
//         <select name="cars" id="cars" onChange={(e) => window.location = e.target.value}>
//           <option value="/land">SELECT LAND</option>
//           <option value="/land/map1">MAP1</option>
//           <option value="/land/map2" selected>MAP2</option>
//         </select>
//         <div style={{overflow: 'auto'}}>
//           {
//             mapData.map((x, indexX) => {
//               return <div key={indexX} style={{display: 'flex', flexWrap: 'unset'}}>
//                 {
//                   x.map((element, indexY) => {
//                     return <div onClick={() => {buyLand(element)}} key={indexY} style={{flex:`0 0 ${size}px`, height: `${size}px`, color: "#fff", backgroundImage: `url(/image/map/${element.prefabId}.png)`, backgroundSize: "100%"}}>
//                       {/* {y.x + ", " + y.y} */}
//                     </div>
//                   })
//                 }
//               </div>
//             })
//           }
//         </div>
//         <Modal open={openModal} onClosed={onModalClosed}>
//             {modalContent.status === "token-not-enough" && (
//             <>
//                 <div className="text-center">
//                 <div className="text-red-600 mb-4">{modalContent.body}</div>
//                 <a href="#" className="btn-primary">
//                     Buy TOKEN
//                 </a>
//                 </div>
//             </>
//             )}

//             {modalContent.status === "token-enough" && (
//             <>
//                 <div className="text-center">
//                 <div className="text-center uppercase">{modalContent.body}</div>
//                 {modalContent.state === "not-approve-token" && (
//                     <>
//                     <ButtonState
//                         onFunction={(e) => onApproveToken}
//                         text="Approve Token"
//                         loading={loading}
//                         classStyle="btn-primary my-4"
//                     />
//                     {/* <button className="btn-primary my-4" onClick={onApproveToken}>
//                         Approve Token
//                     </button> */}
//                     </>
//                 )}
//                 </div>
//             </>
//             )}
//         </Modal>
//       </div>
//     )
// }

// export default MainLand;

const MainLand = () => {
    return <></>
}

export default MainLand