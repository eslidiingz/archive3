import Link from "next/link";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";

const Map = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [open, setOpen] = useState(false);
  const mouseEnter = (name) => {
    document.getElementById("worldBG").className = "relative map-bg " + name;
    document.getElementById("sectionBG").className =
      "vela-full map-def " + name;
  };
  const closeVDO = (name) => {
    document.querySelector("#vdo-overlay").classList.add("hidden");
    setOpen(false);
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <>
      {open && (
        <div className="vdo-wraper" id="vdo-overlay">
          <div className="vdo-modal">
            <ReactPlayer
              className="vdo-player shadow-lg"
              url="https://www.velaverse.io/img/map.mp4"
              playing={isPlaying}
              controls
              playsinline
              autoPlay
              muted
              loop
              width="100%"
              height="100%"
            />
            <div className="close-vdo shadow-lg" onMouseUp={() => closeVDO()}>
              <i className="fas fa-times"></i>
            </div>
          </div>

          <div className="vdo-backdrop" onMouseUp={() => closeVDO()}></div>
        </div>
      )}
      <section className="vela-full map-def map-00" id="sectionBG">
        <div className="content">
          <div className="map-view">
            <div className="relative map-bg map-00" id="worldBG">
              {/* <img
                  src={"/assets/image/map/main-map.jpeg"}
                  alt=""
                  className="m-auto"
                  width="80%"
                /> */}
              <div
                className="map-area map10"
                onMouseUp={() => mouseEnter("map-10")}
              ></div>
              <div
                className="map-area map11"
                onMouseUp={() => mouseEnter("map-11")}
              ></div>

              <div className="map-desc mapdes-11 ">
                <h2 className="font-DBAiry text-3xl">YAAMO</h2>
                <p>อนุสาวรีย์ท้าวสุรนารี</p>
                <div onMouseUp={() => mouseEnter("map-00")} className="p-close">
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

              <div className="map-desc mapdes-10 ">
                <h2 className="font-DBAiry text-3xl">
                  Suranaree University of Technology
                </h2>
                <p>มหาวิทยาลัยเทคโนโลยีสุรนารี</p>
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Map;
