const Whitelist = require("../models/Whitelist"),
  config = require("../configs/app"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.query.address) $or.push({ address: { $regex: req.query.address } });
    if (req.query.roles) $or.push({ roles: { $regex: req.query.roles } });
    if (req.query.flag) $or.push({ flag: { $regex: req.query.flag } });

    const query = $or.length > 0 ? { $or } : {};
    const sort = { createdAt: -1 };
    if (req.query.orderByField && req.query.orderBy) sort[req.query.orderByField] = req.query.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },
  find(req) {
    const limit = +(req.query.size || config.pageLimit);
    const offset = +(limit * ((req.query.page || 1) - 1));
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([
          Whitelist.find(_q.query)
            // .populate("collections")
            .populate({
              path: "whitelistUser",
              select: "title description address",
              populate: { path: "collectionAssetDetail", populate: { path: "userAssets" } },
            })
            .sort(_q.sort)
            .limit(limit)
            .skip(offset),
          Whitelist.countDocuments(_q.query),
        ])
          .then((result) => {
            const rows = result[0],
              count = result[1];
            resolve({
              total: count,
              lastPage: Math.ceil(count / limit),
              currPage: +req.query.page || 1,
              rows: rows,
            });
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  },
  findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Whitelist.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Whitelist.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Whitelist.updateOne({ _id: id }, data);
        resolve(Object.assign(obj, data));
      } catch (error) {
        reject(error);
      }
    });
  },
  insert(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = new Whitelist(data);
        const inserted = await obj.save();
        resolve(inserted);
      } catch (error) {
        reject(ErrorBadRequest(error.message));
      }
    });
  },
  delete(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Whitelist.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Whitelist.deleteOne({ _id: id });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
  register(address, data) {
    return new Promise(async (resolve, reject) => {
      try {
        var obj = new Whitelist(data);
        obj.address = address;
        obj.register = data;
        const inserted = await obj.save();
        resolve(inserted);
      } catch (error) {
        reject(ErrorBadRequest(error.message));
      }
    });
  },
};

module.exports = { ...methods };
