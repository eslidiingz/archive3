import { memo, useState } from "react";
import dayjs from "dayjs";

const CouponTableItem = ({ data = {}, handleOpenRedeemModal }) => {
    const [activeCopyClipboard, setActiveCopyClipboard] = useState(false);

    const handleCopyClipboardCouponCode = async () => {
        navigator.clipboard.writeText(data?.code);

        setActiveCopyClipboard(true);

        setTimeout(() => {
            setActiveCopyClipboard(false)
        }, 1000);
    };

    return (
        <tr>
            <td>
                <div className="d-flex align-items-center text-detail_couponTab">
                    {/* <p className="m-0 cursor-pointer text-couponDetail" onClick={() => handleOpenRedeemModal(data)}> */}
                    <p className="m-0 text-couponDetail">
                        {data?.project?.projectName} xxxxxx
                    </p>
                </div>
            </td>
            <td>
                <div className="d-flex align-items-center justify-content-center">
                    <p className="text-detail_couponTab">Zone {data?.zone + 1}</p>
                </div>
            </td>
            <td>
                <div className="d-flex align-items-center justify-content-center">
                    <p className="text-detail_couponTab">{dayjs(new Date(data?.createdAt)).format('DD/MM/YYYY')}</p>
                </div>
            </td>
            <td>
                <div className="d-flex align-items-center justify-content-center">
                    <p className="text-detail_couponTab">{dayjs(new Date(data?.expirationAt)).format('DD/MM/YYYY')}</p>
                </div>
            </td>
            <td width="270px">
                <div className="d-flex align-items-center justify-content-center">
                    {/* <p className="btn-detail_couponTab">{data?.code}</p>
                    <button className="btn-copy_couponTab" onClick={handleCopyClipboardCouponCode}>
                        {activeCopyClipboard ? 'Copied!' : 'Copy'}
                    </button> */}
                    <button className="btn-use_coupontap" onClick={() => handleOpenRedeemModal(data)}>
                        <p>Use</p>
                    </button>
                </div>

            </td>
        </tr>
    );
};

export default memo(CouponTableItem);