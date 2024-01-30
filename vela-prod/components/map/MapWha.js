import Link from "next/link";
import { useEffect, useState, React } from "react";

function MapWha() {
  const [showMap, setMapWha] = useState("map-00");
  const [showModal, setMapModal] = useState("map-00");

  const onMapWhaBack = () => {
    setMapWha("map-00");
  };
  const onShowArea1 = () => {
    setMapWha("area1");
  };
  const onShowArea2 = () => {
    setMapWha("area2");
  };
  const onShowArea3 = () => {
    setMapWha("area3");
  };
  const onShowArea4 = () => {
    setMapWha("area4");
  };

  return (
    <>
      <section className={`vela-full map-def wha ${showMap}`}>
        <div className="mapname">Meta W</div>
        <div className="content">
          <div className="map-view">
            <div className="map-selector-overlay">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1920 1080"
                style={{
                  enableBackground: "new 0 0 1920 1080",
                }}
                xmlSpace="preserve"
              >
                <path
                  className="mapwha area1"
                  d="m958.6 616.4-83.9 165.3 93.6 2.8 39.9 16.5 134.9-58.6 127.4-32.7 88.3-33.7s5.4-2.5 7.4-8c1.9-5.4 3.1-17.5 10.7-22.1 7.7-4.6 23.1-14.1 23.1-14.1l-107-57.1-107 35s-24 8-56.1 8-171.3-1.3-171.3-1.3z"
                  id="Layer_5"
                  onClick={onShowArea1}
                />
                <path
                  className="mapwha area2"
                  d="m871.8 781.7 80.4-165.2-198.8-3.5-11-21.2 32.2-68.9s2.7-9.3-5.3-13.7S541.8 404 541.8 404l-172.7 59.6-72 11s-4.9.4-19.4 6.6-102 45.1-102 45.1l49.5 31.8s6.8 1.8 14.4 2.7 130.5 19 130.5 19l123.2-20.3 96.1 45.7-72.9 21.9 72.2 45.7 119.7-28.7 40 17.4-50.4 58.3L857 732l-12.1 49.7h26.9z"
                  id="Layer_6"
                  onClick={onShowArea2}
                />
                <path
                  className="mapwha area3"
                  d="m954.5 612.2-196.7-2.7-10.9-18.8 30.3-65.4s5.3-11.6-2.2-16-230.9-106.6-230.9-106.6l82.7-26.4 209.5-56.5s10.5-3.7 17.2-.7c6.8 2.9 50.2 30.6 50.2 30.6s6.5 3.1 18.8-.3 81-23.1 81-23.1 8.4-2.9 25.3.1c16.9 3.1 118.5 21.1 118.5 21.1l-21.8 12.4-172.4 55.5 39.5 28s25.6 15.5 24.7 36.2c-.7 16.9-8.4 29.7-8.4 29.7l-54.4 102.9z"
                  id="Layer_4"
                  onClick={onShowArea3}
                />
                <path
                  className="mapwha area4"
                  d="m1231 340.1-79.2 6.8-23.6 13.8-170.8 55.1 44.2 30s20.3 16.6 19 35.3c-1.3 18.7-18.3 47-18.3 47L960 612.2l174 1.9s29.3.3 84.5-18.7 328.2-113.8 328.2-113.8l57.7 2.2s3.7 1.3 4 4.9c.3 3.5 1.3 25.3 1.3 25.3s-1.8 2.5 9.3-.6c11-3.1 98.5-26.1 98.5-26.1s7.2-1.8 9.9-6.2 15.2-38.4 15.2-38.4 2.4-5.7-6.9-5.7-158.3 3.7-158.3 3.7l-108.8-27.4-35.9-20.3-10.2-10.2-12.1-4.3-25.3 9.1-54.5-19.4-39-7.7-60.6-20.4z"
                  id="Layer_3"
                  onClick={onShowArea4}
                />
              </svg>
            </div>
            <div className={`relative map-bg-wha ${showMap}`}>
              <div className="map-desc area1 ">
                <h2 className="font-DBAiry text-3xl">
                  HDMC(Thailand)Company Limited
                </h2>
                <p>เขต Free Zone และบริษัท Harley Davidson</p>
                <div onClick={onMapWhaBack} className="p-close">
                  <i className="fas fa-times text-black"></i>
                </div>
                <div className="action mt-4">
                  {/* <Link href="https://3d.velaverse.io/hdmc/">
                    <button className="btn-header mr-2">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/land.svg" />
                        <div className="whitespace-nowrap"> Go buy Land </div>
                      </div>
                    </button>
                  </Link> */}

                  {/* <Link href="https://multiplay.velaverse.io/hdmc/"> */}
                  <Link href="https://metaw-esie1-hdmc.velaverse.io/">
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

              <div className="map-desc area2 ">
                <h2 className="font-DBAiry text-3xl">Ford Motor Company</h2>
                <p>บริเวณบริษัท Ford Motor Company</p>
                <div onClick={onMapWhaBack} className="p-close">
                  <i className="fas fa-times text-black"></i>
                </div>
                <div className="action mt-4">
                  {/* <Link href="https://3d.velaverse.io/ford/">
                    <button className="btn-header mr-2">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/land.svg" />
                        <div className="whitespace-nowrap"> Go buy Land </div>
                      </div>
                    </button>
                  </Link> */}

                  {/* <Link href="https://multiplay.velaverse.io/hdmc/"> */}
                  <Link href="https://metaw-esie1-fordmotor.velaverse.io/">
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

              <div className="map-desc area3 ">
                <h2 className="font-DBAiry text-3xl">Suzuki Intersection</h2>
                <p>แยก Suzuki</p>
                <div onClick={onMapWhaBack} className="p-close">
                  <i className="fas fa-times text-black"></i>
                </div>
                <div className="action mt-4">
                  {/* <Link href="https://3d.velaverse.io/suzuki/">
                    <button className="btn-header mr-2">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/land.svg" />
                        <div className="whitespace-nowrap"> Go buy Land </div>
                      </div>
                    </button>
                  </Link> */}

                  {/* <Link href="https://multiplay.velaverse.io/hdmc/"> */}
                  <Link href="https://metaw-esie1-suzuki.velaverse.io/">
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

              <div className="map-desc area4 ">
                <h2 className="font-DBAiry text-3xl">
                  The Water Treatment Plant Phase 1&2
                </h2>
                <p>ระบบบำบัดน้ำเสียเฟส 1&2</p>
                <div onClick={onMapWhaBack} className="p-close">
                  <i className="fas fa-times text-black"></i>
                </div>
                <div className="action mt-4">
                  {/* <Link href="https://3d.velaverse.io/phase1-2/">
                    <button className="btn-header mr-2">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/land.svg" />
                        <div className="whitespace-nowrap"> Go buy Land </div>
                      </div>
                    </button>
                  </Link> */}

                  {/* <Link href="https://multiplay.velaverse.io/hdmc/"> */}
                  <Link href="https://metaw-esie1-wtp.velaverse.io/">
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

export default MapWha;
