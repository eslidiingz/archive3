import Link from "next/link";
import { useEffect, useState, React } from "react";

function MapKorat() {
  // const mouseEnter = (name) => {
  //   document.getElementById("worldBG").className = "relative map-bg " + name;
  //   document.getElementById("sectionBG").className =
  //     "vela-full map-def " + name;
  // };
  const [showMap, setMapKorat] = useState("map-00");
  const [showModal, setMapModal] = useState("map-00");
  
  const onMapKoratBack = () => {
    setMapKorat ("map-00");
  };
  const onShowSuranaree = () => {
    setMapKorat ("map-10");
  };
  const onShowYaamo = () => {
    setMapKorat ("map-11");
  };

  return (
    <>
      <section className={`vela-full map-def ${showMap}`}>
        <div className="mapname">KORAT</div>
        <div className="content">
          <div className="map-view">
            <div className={`relative map-bg ${showMap}`}>
              <div
                className="map-area map10"
                onClick={onShowSuranaree}
              ></div>
              <div
                className="map-area map11"
                onClick={onShowYaamo}
              ></div>

              <div className="map-desc mapdes-11 ">
                <h2 className="font-DBAiry text-3xl">YAAMO</h2>
                <p>อนุสาวรีย์ท้าวสุรนารี</p>
                <div onClick={onMapKoratBack} className="p-close">
                  <i className="fas fa-times text-black"></i>
                </div>
                <div className="action mt-4">
                  <Link href="https://3d.velaverse.io/yaamo/">
                    <button className="btn-header mr-2">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/land.svg" />
                        <div className="whitespace-nowrap"> Go buy Land </div>
                      </div>
                    </button>
                  </Link>

                  <Link href="https://multiplay.velaverse.io/yaamo/">
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

              <div className="map-desc mapdes-10 ">
                <h2 className="font-DBAiry text-3xl">
                  Suranaree University of Technology
                </h2>
                <p>มหาวิทยาลัยเทคโนโลยีสุรนารี</p>
                <div onClick={onMapKoratBack} className="p-close">
                  <i className="fas fa-times text-black"></i>
                </div>
                <div className="action mt-4">
                  <Link href="https://3d.velaverse.io/sut/">
                    <button className="btn-header mr-2">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/land.svg" />
                        <div className="whitespace-nowrap"> Go buy Land </div>
                      </div>
                    </button>
                  </Link>
                  <Link href=" https://multiplay.velaverse.io/sut/">
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

export default MapKorat;
