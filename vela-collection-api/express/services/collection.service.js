const Collection = require("../models/Collection"),
  config = require("../configs/app"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.query.title) $or.push({ title: { $regex: req.query.title } });
    if (req.query.owner) $or.push({ owner: { $regex: req.query.owner } });

    const query = $or.length > 0 ? { $or } : {};
    const sort = { createdAt: -1 };
    if (req.query.orderByField && req.query.orderBy)
      sort[req.query.orderByField] =
        req.query.orderBy.toLowerCase() == "desc" ? -1 : 1;
    return { query: query, sort: sort };
  },

  findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Collection.findById(id);
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
          Collection.find(_q.query).sort(_q.sort).limit(limit).skip(offset),
          Collection.countDocuments(_q.query),
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
        const obj = await Collection.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Collection.updateOne({ _id: id }, data);
        resolve(Object.assign(obj, data));
      } catch (error) {
        reject(error);
      }
    });
  },
  insert(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = new Collection(data);
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
        const obj = await Collection.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Collection.deleteOne({ _id: id });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },

  updateHolder(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Collection.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Collection.updateOne(
          {
            _id: id,
          },
          {
            $addToSet: { holder: [data.holder] },
          }
        );
        resolve(Object.assign(obj, data));
      } catch (error) {
        reject(error);
      }
    });
  },
  updateAssets(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Collection.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Collection.updateOne(
          {
            _id: id,
          },
          {
            $addToSet: { assets: [data.asset] },
          }
        );
        resolve(Object.assign(obj, data));
      } catch (error) {
        reject(error);
      }
    });
  },
  updateTransaction(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Collection.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Collection.updateOne(
          {
            _id: id,
          },
          {
            $push: { transaction: [data] },
          }
        );
        resolve(Object.assign(obj, data));
      } catch (error) {
        reject(error);
      }
    });
  },
  findCollectionByAsset(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Collection.find({ assets: { $in: id } })
          .populate({
            path: "user",
            populate: { path: "whitelist"},
          });
        resolve(obj);
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = { ...methods };
