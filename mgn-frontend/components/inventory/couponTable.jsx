import { memo, useState } from "react";

import Spinner from "../Spinner";
import CouponDetail from "../modal/CouponDetail";
import CouponTableItem from "./couponTableItem";

const CouponTable = ({ coupons = [], loading = true }) => {
    const [selectedCoupon, setSelectedCoupon] = useState({});
    const [showRedeemModal, setShowRedeemModal] = useState(false);

    const handleOpenRedeemModal = async (couponDetail) => {
        try{
            setSelectedCoupon(couponDetail);
            setShowRedeemModal(true);
        }catch{

        }
    };

    const handleCloseRedeemModal = async () => setShowRedeemModal(false);

    return (
        <>
            <table className="table table-bordered table-striped roundedTable test" cellspacing="0" border="0" cellpadding="0" width="100%">
                <thead>
                    <tr>
                        <th className="text-topic_couponTab" width="180px">Project</th>
                        <th className="text-topic_couponTab text-center" width="150px">Zone</th>
                        <th className="text-topic_couponTab text-center" width="200px">Genarate Date</th>
                        <th className="text-topic_couponTab text-center" width="200px">Expiration Date</th>
                        <th className="text-topic_couponTab text-center" width="200px">Voucher Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && <tr><td colSpan={5}><Spinner showText={false} size={'lg'} /></td></tr>}
                    {!loading && coupons.length < 1 && <tr><td colSpan={5}><h4 className="text-center my-2">Voucher Not Found.</h4></td></tr>}
                    {!loading && Array.isArray(coupons) && coupons.map((coupon, index) => <CouponTableItem key={index} data={coupon} handleOpenRedeemModal={handleOpenRedeemModal} />)}
                    {/* <CouponTableItem handleOpenRedeemModal={handleOpenRedeemModal}/> */}
                </tbody>
            </table>
            <CouponDetail
                data={selectedCoupon}
                show={showRedeemModal}
                onClose={handleCloseRedeemModal}
            />
        </>
    );
};

export default memo(CouponTable);
