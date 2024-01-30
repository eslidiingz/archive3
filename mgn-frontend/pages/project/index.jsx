import Mainlayout from "../../components/layouts/Mainlayout";
import { useEffect, useState } from "react";
import React from "react";
import Countdown, {
  zeroPad,
  calcTimeDelta,
  formatTimeDelta,
} from "react-countdown";
import Spinner from "../../components/Spinner";
import ProjectCard from "../../components/project/projectCard";
import OnBuy from "../../components/modal/OnBuy";
import { useWalletContext } from "../../context/wallet";
import { approveUsdc, getIsApprove } from "../../models/BUSDToken";
import Config from "../../configs/config";
import { unlimitAmount } from "../../utils/misc";
import Swal from "sweetalert2";
import { web3Modal } from "../../utils/providers/connector";
import { allowanced } from "../../models/MGNToken";
import { BigNumber } from "ethers";
import { placeBuyLand, getSellingLand } from "../../models/Land";
import { getIsApproveLand } from "../../models/BUSDToken";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_ALL_ACTIVE_PROJECTS } from "../../utils/gql/project";
import { INSERT_ASSETS } from "../../utils/gql/inventory";
import dayjs from "dayjs";

const Project = () => {
  const [handleFetchActiveProject] = useLazyQuery(GET_ALL_ACTIVE_PROJECTS, {
    fetchPolicy: "network-only",
  });
  const [handleInsertAssets] = useMutation(INSERT_ASSETS);

  const REGEX_ONLY_NUMBER = /^[0-9\b]+$/;
  const today = dayjs().valueOf();

  const { wallet } = useWalletContext();

  const [disabledButton, setDisabledButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOnBuyModal, setOnBuyModal] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const [infoInputAmount, setInfoInputAmount] = useState("");
  const [infoInputZone, setInfoInputZone] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [sellingLand, setSellingLand] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [projectDetal, setProjectDetail] = useState({
    projectId: null,
    projectName: "",
    openPreSell: "",
    startPlanting: "",
    platingDuration: 180,
    readyToUseAt: "",
    price: 300,
  });

  const handleCloseOnBuyModal = () => {
    setOnBuyModal(false);
  };

  const handleChangeTotalPrice = (count) => {
    const total = count * projectDetal.price;
    setTotalAmount(total);
  };

  const handleClickApproveUsdc = async () => {
    try {
      setDisabledButton(true);
      if (wallet) {
        const res = await approveUsdc(Config.LAND_CA, unlimitAmount);
        if (res) {
          setIsApprove(true);
          Swal.fire("Success", "Approve successfully.", "success");
        } else {
          Swal.fire("Warning", "Failed to approve.", "warning");
        }
      } else {
        if (typeof window.ethereum === "undefined") {
          Swal.fire("Warning", "Please, Install metamask wallet", "warning");
        } else {
          const _web3Modal = web3Modal();
          await _web3Modal.connect();
        }
      }
    } catch {
    } finally {
      setDisabledButton(false);
    }
  };

  const handleClickBuyZone = async (_zone, _projectDetal) => {
    if (wallet) {
      setSelectedZone(_zone);
      setProjectDetail(_projectDetal);
      const resApprove = await checkIsApproveUsdc();
      resApprove ? setIsApprove(true) : setIsApprove(false);
      setInfoInputZone(_zone);
      setOnBuyModal(true);
    } else {
      if (typeof window.ethereum === "undefined") {
        Swal.fire("Warning", "Please, Install metamask wallet", "warning");
      } else {
        Swal.fire("Warning", "Please connect your wallet", "warning");
        const _web3Modal = web3Modal();
        await _web3Modal.connect();
      }
    }
  };

  const checkIsApproveUsdc = async () => {
    let isApprovedToken = await getIsApproveLand(wallet);
    return parseInt(BigNumber.from(isApprovedToken)._hex, 16) < 1
      ? false
      : true;
  };

  const handleMappingInsertAssets = async (assets) => {
    try {
      return assets.map((asset) => {
        const today = dayjs().format("YYYY-MM-DD HH:mm:ss");

        return {
          token_id: asset.tokenId,
          project_id: asset.projectId,
          zone_id: asset.zoneId,
          wallet_address: wallet,
          is_claim: false,
          created_at: today,
          updated_at: today,
        };
      });
    } catch {
      return [];
    }
  };

  const handleBuyLand = async () => {
    try {
      setDisabledButton(true);
      if (wallet) {
        if (infoInputAmount > 0) {
          const res = await placeBuyLand(
            projectDetal.projectId,
            infoInputZone,
            infoInputAmount
          );

          if (res.length) {
            const assets = res;

            if (assets.length) {
              const mappingVariable = await handleMappingInsertAssets(assets);

              await handleInsertAssets({
                variables: {
                  objects: mappingVariable,
                },
                async onCompleted() {
                  Swal.fire("Success", "Transaction successful.", "success");
                },
                async onError(error) {
                  Swal.fire("Success", "Transaction successful.", "success");
                },
              });
            } else {
              Swal.fire("Success", "Transaction successful.", "success");
            }

            setOnBuyModal(false);
            await handleFetchSellingLand();
          } else {
            Swal.fire("Warning", "Failed to buy.", "warning");
          }
        } else {
          Swal.fire("Warning", "Please input the amount", "warning");
        }
      } else {
        if (typeof window.ethereum === "undefined") {
          Swal.fire("Warning", "Please, Install metamask wallet", "warning");
        } else {
          const _web3Modal = web3Modal();
          await _web3Modal.connect();
        }
      }
    } catch (err) {
    } finally {
      setDisabledButton(false);
    }
  };

  const handleFetchSellingLand = async () => {
    try {
      const activeProjects = await handleFetchActiveProject({
        variables: { date: dayjs().format("YYYY-MM-DDTHH:mm:ss") },
      });
      const sellingLand = await getSellingLand(activeProjects.data.projects);

      const compareTime = (value) => {
        return value.endSaleAt > today;
      };

      const filteredLands = sellingLand.filter(compareTime);

      setSellingLand(filteredLands);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveEndedProject = (index) => {
    setSellingLand((prevState) => {
      const tempSellingLands = [...prevState];
      return [...tempSellingLands.filter((land, idx) => idx !== index)];
    });
  };

  const initialize = async () => {
    try {
      setLoading(true);
      await handleFetchSellingLand();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) initialize();

    return () => {
      mounted = false;
    };
  }, [wallet]);

  return (
    <>
      <section className="py-5">
        <div className="container fix-container">
          <div className="row">
            <div className="col-12 my-3 text-center">
              <h5 className="ci-color-brown fw-bolder">Project</h5>
              <h1 className="ci-color-green">SUT project</h1>
              <p>
                SUT project open for sale 2 zone aiming for planting asset on 4
                August 2022. After planting, there will be a period of raising
                cannabis plants for 6 months (180 days) to be in the full
                status. When the asset full, you can press "Use" for add value
                and sell back with an added value of 15% from the original
                selling price (300 CNB). During planting you can exchange your
                asset to the marketplace anytime which has an only 3% fee after
                reselling.
              </p>
            </div>
          </div>
          <div className="row d-flex justify-content-center my-5 py-5">
            {loading && <Spinner showText={false} size={"lg"} />}
            {!loading &&
              Array.isArray(sellingLand) &&
              sellingLand.map(
                (
                  {
                    land,
                    projectName = "",
                    projectId,
                    startSaleAt = 0,
                    endSaleAt = 0,
                    amountLeft = 0,
                    claimAt = 0,
                  },
                  index
                ) => (
                  <div
                    className="col-12 col-md-6 col-lg-5 col-xl-4 my-3"
                    key={`${land}_${index}_${endSaleAt}`}
                  >
                    {/* <ProjectCard
                      index={index}
                      projectName={projectName}
                      projectId={projectId}
                      land={land}
                      startSaleAt={startSaleAt}
                      endSaleAt={endSaleAt}
                      handleClickBuyZone={handleClickBuyZone}
                      amountLeft={amountLeft}
                      handleRemoveEndedProject={handleRemoveEndedProject}
                      projectDetail={projectDetal}
                      claimAt={claimAt}
                      handleFetchActiveProject={handleFetchActiveProject}
                    /> */}
                  </div>
                )
              )}
          </div>
        </div>
        <OnBuy
          onClose={handleCloseOnBuyModal}
          show={showOnBuyModal}
          approveUsdc={handleClickApproveUsdc}
          isApprove={isApprove}
          handleBuyLand={handleBuyLand}
          setInfoInputAmount={setInfoInputAmount}
          infoInputAmount={infoInputAmount}
          handleChangeTotalPrice={handleChangeTotalPrice}
          totalAmount={totalAmount}
          tittle="Buy Asset"
          img="/assets/image/card/cannabis.webp"
          zone={selectedZone}
          projectDetal={projectDetal}
          disabledButton={disabledButton}
          zoneDetail={projectDetal}
        />
      </section>
    </>
  );
};

export default Project;
Project.layout = Mainlayout;
