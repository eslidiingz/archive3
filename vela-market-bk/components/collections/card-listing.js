import { useEffect, useState } from "react";

const CardListing = (props) => {
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    setMeta(props.meta);
  }, []);
  return (
    <a className="relative">
      <div className="relative w-full h-72 rounded-lg overflow-hidden">
        <img
          className="w-full h-full object-center object-cover cursor-pointer"
          src={
            meta && typeof meta[1] !== "undefined"
              ? meta[1].image
              : "/assets/image/no-image.png"
          }
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="font-medium text-gray-900">
            {meta && typeof meta[1] !== "undefined" ? meta[1].name : "-"}
          </h3>
          <p className="text-gray-500">
            {meta && typeof meta[1] !== "undefined" ? meta[1].description : "-"}
          </p>
        </div>
        <p className="text-5xl font-medium text-gray-400">
          {meta && typeof meta[1] !== "undefined" ? meta[0] : 0}
        </p>
      </div>
    </a>
  );
};

export default CardListing;
