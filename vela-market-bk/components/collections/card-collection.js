import { useEffect, useState } from "react";
import { numberFormat } from "../../utils/number";

const CardCollection = (props) => {
  const [meta, setMeta] = useState(null);
  const [type, setType] = useState("");

  useEffect(() => {
    setMeta(props.meta);
    setType(props.type);
  }, []);
  return (
    <a className="relative">
      <div className="relative w-full h-72 rounded-lg overflow-hidden">
        <img
          className="w-full h-full object-center object-cover"
          src={meta ? meta[1].image : "/assets/image/no-image.png"}
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="font-medium text-gray-900">
            {meta ? meta[1].name : "-"}
          </h3>
          <p className="text-gray-500">{meta ? meta[1].description : "-"}</p>
        </div>
        <p className="text-5xl font-medium text-gray-400">
          {meta ? meta[0] : 0}
        </p>
      </div>
      <div className="absolute top-0 inset-x-0 h-72 rounded-lg p-4 flex items-end justify-end overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"></div>
        <p className="relative text-lg font-semibold text-white mx-2">
          {type ? type : "-"}
        </p>
        <p className="relative text-lg font-semibold text-white">
          {meta ? numberFormat(meta[1].price) : "-"} EPIC
        </p>
      </div>
    </a>
  );
};

export default CardCollection;
