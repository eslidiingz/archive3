const mongoose = require("mongoose");

const Asset = require("../models/Asset"),
  config = require("../configs/app"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");

const methods = {
  scopeSearch(req) {
    $or = [];

    let _obj = {};

    if (req.query.address) _obj.address = { $regex: req.query.address };
    if (req.query.verify) _obj.verify = { $regex: req.query.verify };
    if (req.query.token) _obj.token = { $regex: req.query.token };
    if (req.query.hash) _obj.hash = { $regex: req.query.hash };

    $or.push(_obj);

    // if (req.query.address) $or.push({ address: { $regex: req.query.address } });

    // if (req.query.token)
    //   $or.push({
    //     token: { $regex: req.query.token },
    //   });

    // if (req.query.verify)
    //   $or.push({
    //     verify: { $regex: req.query.verify },
    //   });

    // if (req.query.hash) $or.push({ hash: { $regex: req.query.hash } });

    const query = $or.length > 0 ? { $or } : {};
    const sort = { createdAt: -1 };
    if (req.query.orderByField && req.query.orderBy)
      sort[req.query.orderByField] =
        req.query.orderBy.toLowerCase() == "desc" ? -1 : 1;

    return { query: query, sort: sort };
  },

  findAddressToken(address, token) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Asset.find({
          $and: [{ address: address }, { token: token }],
        });
        resolve(obj);
      } catch (error) {
        reject(error);
      }
    });
  },

  findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Asset.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        resolve(obj.toJSON());
      } catch (error) {
        reject(ErrorNotFound("id: not found"));
      }
    });
  },
  find(req) {
    const limit = +(req.query.size || config.pageLimit);
    const offset = +(limit * ((req.query.page || 1) - 1));
    const _q = methods.scopeSearch(req);

    return new Promise(async (resolve, reject) => {
      try {
        Promise.all([
          req.query.paginate === "NO"
            ? Asset.find(_q.query).sort(_q.sort)
            : Asset.find(_q.query).sort(_q.sort).limit(limit).skip(offset),
          Asset.countDocuments(_q.query),
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
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Asset.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Asset.updateOne({ _id: id }, data);
        resolve(Object.assign(obj, data));
      } catch (error) {
        reject(error);
      }
    });
  },
  updateVisible(address, token, visible = true) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Asset.findOne({ address, token });

        if (!obj) reject(ErrorNotFound("id: not found"));

        const success = await Asset.updateOne({ _id: obj._id }, {visible});

        const response = {
          status: false,
          result: visible
        };

        if(success?.ok){
          response.status = true;
          response.result = {visible};
        }else{
          response.status = false;
          response.result = {visible: !visible};
        }
        
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  },
  insert(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = new Asset(data);
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
        const obj = await Asset.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Asset.deleteOne({ _id: id });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
