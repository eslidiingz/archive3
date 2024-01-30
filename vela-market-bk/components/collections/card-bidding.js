import { useEffect, useState } from "react";


const CardBidding = (props) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(props.data);
        setDetail();
    }, []);

    function setDetail () {
        console.log(props.data);
    }

    return (
        <a className="relative">
            <div className="relative w-full h-72 rounded-lg overflow-hidden">
            <img
                className="w-full h-full object-center object-cover"
                src={data ? (data[1] ? data[1].image : "/assets/image/no-image.png") : "/assets/image/no-image.png"}
            />
            </div>
        </a>
    )
}

export default CardBidding;