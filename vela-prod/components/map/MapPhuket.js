import Link from "next/link";
import { useEffect, useState, React } from "react";

function MapPhuket() {
  const [showMap, setMapPhuket] = useState("map-00");
  const [showModal, setMapModal] = useState("map-00");
  
  const onMapPhuketBack = () => {
    setMapPhuket ("map-00");
  };
  const onShowCrescentIsle = () => {
    setMapPhuket ("crescent-isle");
  };
  const onShowOldTown = () => {
    setMapPhuket ("old-town");
  };

  return (
    <>
      
      <section className={`vela-full map-def phuket ${showMap}`}>
        <div className="mapname">PHUKET</div>
        <div className="content">
          <div className="map-view">
            <div className={`relative map-bg-phuket ${showMap}`}>
              <div
                className="map-area map-crescent-isle"
                onClick={onShowCrescentIsle}
              ></div>
              <div
                className="map-area map-old-town"
                onClick={onShowOldTown}
              ></div>

              <div className="map-desc crescent-isle ">
                <h2 className="font-DBAiry text-3xl">
                  Crescent Isle
                </h2>
                <p>เกาะพระจันทร์เสี้ยว</p>
                <div onClick={onMapPhuketBack} className="p-close">
                  <i className="fas fa-times text-black"></i>
                </div>
                <div className="action mt-4">
                  <Link href="https://3d.velaverse.io/crescent-isle/">
                    <button className="btn-header mr-2">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/land.svg" />
                        <div className="whitespace-nowrap"> Go buy Land </div>
                      </div>
                    </button>
                  </Link>
                  <Link href=" https://multiplay.velaverse.io/crescent-isle/">
                    <button className="btn-header-so">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/game.svg" />
                        <div className="whitespace-nowrap">
                          {" "}
                          Enter Velaverse{" "}
                        </div>
                      </div>
                    </button>
                  </Link>
                </div>
              </div>

              <div className="map-desc old-town ">
                <h2 className="font-DBAiry text-3xl">Old Town</h2>
                <p>เมืองเก่า</p>
                <div onClick={onMapPhuketBack} className="p-close">
                  <i className="fas fa-times text-black"></i>
                </div>
                <div className="action mt-4">
                  <Link href="https://3d.velaverse.io/oldtown/">
                    <button className="btn-header mr-2">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/land.svg" />
                        <div className="whitespace-nowrap"> Go buy Land </div>
                      </div>
                    </button>
                  </Link>

                  <Link href="https://multiplay.velaverse.io/oldtown/">
                    <button className="btn-header-so">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/game.svg" />
                        <div className="whitespace-nowrap">
                          {" "}
                          Enter Velaverse{" "}
                        </div>
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MapPhuket;
