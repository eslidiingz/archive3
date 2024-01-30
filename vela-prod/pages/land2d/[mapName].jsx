import MainLand from "/components/Land/Map";
import FiatLand from "../../components/Land/MapFiat";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/** All map */
const maps = ["yaamo", "sut", "oldtown", "crescentIsle"];

/** Map area */
const mapKorat = ["yaamo", "sut"];
const mapPhuket = ["oldtown", "crescentIsle"];

/** Map type */
const mapDefaultArray = ["yaamo", "sut"];
const mapFiatArray = ["oldtown", "crescentIsle"];

const Map = () => {
  const router = useRouter();
  const [mapName, setMapName] = useState(null);
  const [mapSlug, setMapSlug] = useState(null);

  const initialize = async () => {
    const _mapName = router.query.mapName;
    setMapName(_mapName);

    if (maps.indexOf(_mapName) == -1) window.location.href = "/map";

    if (mapKorat.indexOf(_mapName) != -1)
      setMapSlug(`KORAT > ${_mapName.toUpperCase()}`);

    if (mapPhuket.indexOf(_mapName) != -1)
      setMapSlug(`PHUKET > ${_mapName.toUpperCase()}`);
  };

  useEffect(() => {
    if (router.isReady) initialize();
  }, [router]);

  if (mapName) {
    // if (mapName !== "oldtown") {
    //   return <MainLand mapName={router.query.mapName} mapSlug={mapSlug} />;
    // } else {
    //   return <FiatLand mapName={router.query.mapName} mapSlug={mapSlug} />;
    // }

    if (mapDefaultArray.indexOf(mapName) !== -1) {
      return <MainLand mapName={router.query.mapName} mapSlug={mapSlug} />;
    }

    if (mapFiatArray.indexOf(mapName) !== -1) {
      return <FiatLand mapName={router.query.mapName} mapSlug={mapSlug} />;
    }
  } else {
    return <></>;
  }
};

export default Map;
