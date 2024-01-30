import { MongoClient } from "mongodb";
import moment from "moment";

export default async function handler(req, res) {
  // const client = await MongoClient.connect(process.env.MONGO_DB_CONN);
  const client = await MongoClient.connect(
    "mongodb+srv://mip:faOcdK5vCayj8XGQ@cluster0.ovprs.mongodb.net/mip_p2p?retryWrites=true&w=majority"
  );
  const db = client.db();

  db.collection("payso_session").findOne(
    {
      //
    },
    {
      sort: { _id: -1 },
    },
    async function (err, result) {
      let refno_run;
      let refno;

      if (result) {
        console.log("found");
        refno_run = parseInt(result.refno_run) + 1;
      } else {
        console.log("not found");
        refno_run = 1;
      }

      refno_run = (refno_run + 100000000).toString();
      refno_run = refno_run.substring(refno_run.length - 8);
      refno = moment().format("YYMM") + refno_run;

      var values = {
        refno: refno,
        refno_run: refno_run,
        method: req.body.method,
        walletaddress: req.body.walletaddress,
        email: req.body.email,
        name: req.body.name,
        amount: req.body.amount,
        total: req.body.total,
        body: req.body,
        status: "pending",
        created_at: new Date().getTime(),
      };

      let rs = await db.collection("payso_session").insertOne(values);
      let id = rs.insertedId.toString();

      res.status(200).json(refno);

      // if (req.body.method == "fiat-qrcode") {
      //   res.redirect(302, "/pay-fiat-qr/" + refno);
      // } else {
      //   res.redirect(302, "/pay-fiat-credit/" + refno);
      // }
    }
  );
}
