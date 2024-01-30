import { useEffect, useState } from "react";

const CardCollection = (props) => {
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    setMeta(props.meta);
  }, []);
  return (
    <div>
      <div className="relative card-item-collection">
        <div className="relative overflow-hidden">
          <img
            className="w-full h-full object-center object-cover cursor-pointer"
            src={"/assets/image/no-image.png"}
          />
        </div>
      </div>
      <div className="mt-2">
        <h3 className="card-buybid-title">Collection Name</h3>
        <p className="text-sm text-gray-500">Address 0x0000000000000000</p>
      </div>
    </div>
  );
};

export default CardCollection;
