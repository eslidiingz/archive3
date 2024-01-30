import fs from "fs";

export default async function readJSON(req, res) {
  const path = `${req.body}`;
  const example = await fs.readFileSync(path);
  var list = JSON.parse(example);
  return res.status(200).json({ list });
}
