import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getWalletAccount } from "../../utils/web3/init";

const Fait = () => {
  const priceBahtPerLand = 1000;
  const amountLand = 1;
  const router = useRouter();

  const [form, setForm] = useState({
    walletaddress: "0x00",
    email: "",
    name: "",
    total: "1000",
    amount: "1",
  });

  const onPayNow = async (e) => {
    e.preventDefault();

    let { data } = await axios.post(`/api/create-session`, form);

    console.log("refno: ", data);

    if (data) {
      const refno = data;

      if (form.method === "fiat-credit") {
        const formPayment = document.createElement("form");
        formPayment.setAttribute("method", "post");
        formPayment.setAttribute("target", "_self");
        formPayment.setAttribute("id", "formPayment");
        formPayment.setAttribute(
          "action",
          "https://www.thaiepay.com/epaylink/payment.aspx"
        );

        const merchantid = "08034884";

        document.querySelector("body").append(formPayment);

        const refFormPayment = document.getElementById("formPayment");

        const html = `
        <input type="hidden" name="merchantid" value="${merchantid}" />
        <input type="hidden" name="refno" value="${refno}" />
        <input type="hidden" name="customeremail" value="${form.email}" />
        <input type="hidden" name="cc" value="00" />
        <input type="hidden" name="productdetail" value="Velaverse LAND" />
        <input type="hidden" name="total" value="${form.total}" />
      `;

        refFormPayment.innerHTML += html;
        formPayment.submit();
        return 0;
      } else if (form.method === "fiat-qrcode") {
        // 220100000074
        router.push(`/payment/fait-checkout-qr/${refno}`);
      }
    } else {
      alert("Cannot pay, Please try again.");
    }
  };

  const setFormChangeHandler = (event) => {
    setForm((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const setInitState = async () => {
    setForm({
      method: "fiat-credit",
      walletaddress: await getWalletAccount(),
      amount: amountLand,
      total: priceBahtPerLand * amountLand,
    });
  };

  useEffect(() => {
    setInitState();
  }, []);

  return (
    <>
      <form onSubmit={(e) => onPayNow(e)}>
        <div className="text-white">
          <div>
            name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={setFormChangeHandler}
              className="text-black"
              required
            />
          </div>

          <div>
            Email:
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={setFormChangeHandler}
              className="text-black"
              required
            />
          </div>

          {/* <div>
          <label>เลขที่คำสั่งซื้อ</label>
          <div>{form.refno}</div>
        </div> */}

          <div>
            Description: <span>Velaverse LAND</span>
          </div>

          <div>
            Price per land: <span>{priceBahtPerLand}</span> Baht
          </div>

          <div>
            Land amount: <span>{form.amount}</span>
          </div>

          <div>
            Total: <span>{form.total}</span>
          </div>
        </div>

        <hr className="my-3" />

        <div className="text-white">
          <div className="panel">
            <div className="panel-title">Pay type:</div>
            <div className="panel-body">
              <div className="py-3">
                <label>
                  <input
                    type="radio"
                    name="method"
                    value="fiat-credit"
                    checked={form.method === "fiat-credit"}
                    onChange={setFormChangeHandler}
                    required
                  />
                  <span className="mx-2">Credit card / Promptpay</span>
                </label>
              </div>
              <div className="py-3">
                <label>
                  <input
                    type="radio"
                    name="method"
                    value="fiat-qrcode"
                    checked={form.method === "fiat-qrcode"}
                    onChange={setFormChangeHandler}
                    required
                  />
                  <span className="mx-2">QR Code</span>
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-400 border-b-4 border-blue-700 hover:border-blue-500 text-white text-center py-2 px-4 rounded"
          >
            Pay Now
          </button>
        </div>
      </form>
    </>
  );
};

export default Fait;
