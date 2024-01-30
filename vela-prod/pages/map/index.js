import Link from "next/link";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import Slider from "react-slick";

import dynamic from "next/dynamic";

// const MapKorat = dynamic(
//   () => import('../../components/map/MapKorat'),
//   { ssr: false }
// )

// const MapPhuket = dynamic(
//   () => import('../../components/map/MapPhuket'),
//   { ssr: false }
// )

import MapKorat from "../../components/map/MapKorat";
import MapPhuket from "../../components/map/MapPhuket";
import MapWhaTower from "../../components/map/MapWhaTower";
import MapWha from "../../components/map/MapWha";



const Map = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [open, setOpen] = useState(false);

const closeVDO = (name) => {
  document.querySelector("#vdo-overlay").classList.add("hidden");
  setOpen(false);
};

useEffect(() => {
  setOpen(true);
}, []);


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrow: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // const mapLists = [
  //   {
  //     id: 1,
  //     name: "Korat",
  //     href: "#",
  //     img: "/assets/image/map/view-korat.jpg",
  //     desc:
  //       "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  //   },
  //   {
  //     id: 1,
  //     name: "Phuket",
  //     href: "#",
  //     img: "/assets/image/map/view-phuket.jpg",
  //     desc:
  //       "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  //   },
  // ];

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

      <Slider {...settings}>
        <MapKorat />
        <MapPhuket />
        <MapWhaTower />
        <MapWha />
      </Slider>

      {/* <div className="heading">
        <h2>Map</h2>
        <p>
          Here you can search and buy creator&apos;s ASSETS with CLASS to
          incorporate them into your LAND
        </p>
      </div>
      <div className="maplists-section">
        <div className="container">
          <div className="maplists-area">
            {mapLists.map((item, index) => (
              <div className="card" key={index}>
                <img className="img_progress" src={item.img} />
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Map;
