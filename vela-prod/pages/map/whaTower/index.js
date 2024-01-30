import Link from "next/link";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";

const Map = () => {
  const mouseEnter = (name) => {
    document.getElementById("worldBGPhuket").className =
      "relative map-bg-phuket " + name;
    document.getElementById("sectionBGPhuket").className =
      "vela-full phuket map-def " + name;
  };

  return (
    <>
      <section className="vela-full map-def phuket map-00" id="sectionBGPhuket">
        <div className="content">
          <div className="map-view">
            <div className="relative map-bg-phuket map-00" id="worldBGPhuket">
              {/* <img
                  src={"/assets/image/map/main-map.jpeg"}
                  alt=""
                  className="m-auto"
                  width="80%"
                /> */}
              <div
                className="map-area map-crescent-isle"
                onMouseUp={() => mouseEnter("crescent-isle")}
              ></div>
              <div
                className="map-area map-old-town"
                onMouseUp={() => mouseEnter("old-town")}
              ></div>

              <div className="map-desc crescent-isle ">
                <h2 className="font-DBAiry text-3xl">
                  Crescent Isle
                </h2>
                <p>เกาะพระจันทร์เสี้ยว</p>
                <div onMouseUp={() => mouseEnter("map-00")} className="p-close">
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
                    {/* ใส่ link ตรงนี้นะจ้ะ */}
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
                <div onMouseUp={() => mouseEnter("map-00")} className="p-close">
                  <i className="fas fa-times text-black"></i>
                </div>
                <div className="action mt-4">
                  <Link href="https://market.velaverse.io/land2d/oldtown/">
                    <button className="btn-header mr-2">
                      <div className="flex justify-center gap-2">
                        <img alt="" src="/assets/image/icons/land.svg" />
                        <div className="whitespace-nowrap"> Go buy Land </div>
                      </div>
                    </button>
                  </Link>

                  <Link href="https://multiplay.velaverse.io/yaamo/">
                    {/* ใส่ link ตรงนี้นะจ้ะ */}
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

export default Map;
