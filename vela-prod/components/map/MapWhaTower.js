import Link from "next/link";
import { useEffect, useState, React } from "react";

function MapPhuket() {
  const [showMap, setMapWha] = useState("map-00");
  const [showModal, setMapModal] = useState("map-00");

  const onMapWhaTowerBack = () => {
    setMapWha("map-00");
  };
  const onShowWhaTower = () => {
    setMapWha("tower-wha");
  };

  return (
    <>
      <section className={`vela-full map-def wha-tower ${showMap}`}>
        <div className="mapname">WHA Tower</div>
        <div className="content">
          <div className="map-view">
            <div className={`relative map-bg-wha-tower ${showMap}`}>
              {/* <div
                className="map-area map-crescent-isle"
                onClick={onShowCrescentIsle}
              ></div> */}
              <div
                className="map-area map-tower-wha"
                onClick={onShowWhaTower}
              ></div>

              <div className="map-desc tower-wha ">
                <h2 className="font-DBAiry text-3xl">WHA Tower</h2>
                {/* <p>เมืองเก่า</p> */}
                <div onClick={onMapWhaTowerBack} className="p-close">
                  <i className="fas fa-times text-black"></i>
                </div>
                <div className="action mt-4">
                  {/* <Link href="https://3d.velaverse.io/wha-tower/">
                    <button className="btn-header mr-2">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/land.svg" />
                        <div className="whitespace-nowrap"> Go buy Land </div>
                      </div>
                    </button>
                  </Link> */}

                  <Link href="https://metaw-whatower.velaverse.io/">
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
}

export default MapPhuket;
