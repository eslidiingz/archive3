const pool = require("../configs/databases").mysql();
const Users = require("../models/User"),
  config = require("../configs/app"),
  { ErrorBadRequest, ErrorNotFound } = require("../configs/errorMethods");

const methods = {
  scopeSearch(req) {
    $or = [];
    if (req.query.address) $or.push({ address: { $regex: req.query.address } });
    if (req.query.title) $or.push({ title: { $regex: req.query.title } });

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
        const obj = await Users.findById(id);
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
          Users.find(_q.query).sort(_q.sort).limit(limit).skip(offset),
          Users.countDocuments(_q.query),
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
  insert(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = new Users(data);
        const inserted = await obj.save();
        resolve(inserted);
      } catch (error) {
        reject(ErrorBadRequest(error.message));
      }
    });
  },
  update(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Users.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Users.updateOne({ _id: id }, data);
        resolve(Object.assign(obj, data));
      } catch (error) {
        reject(error);
      }
    });
  },
  delete(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const obj = await Users.findById(id);
        if (!obj) reject(ErrorNotFound("id: not found"));
        await Users.deleteOne({ _id: id });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  },
  registerByOAuth(data) {
    return new Promise(async (resolve, reject) => {
      try {
        pool.getConnection(async (err, connection) => {
          if (err) {
            connection.release();
            return reject(ErrorBadRequest(`Failed to sign in with ${data.provider}.`));
          }

          connection.query("SET FOREIGN_KEY_CHECKS=0", (error) => {
            if (error) {
              connection.release();
              return reject(ErrorBadRequest(`Failed to sign in with ${data.provider}.`));
            }

            connection.query("SELECT id, `username`, model_id, nickname FROM `character` WHERE owner = ?", [data.walletAddress], async (error, rows) => {
              if (error) {
                connection.release();
                return reject(ErrorBadRequest(`Failed to sign in with ${data.provider}.`));
              }

              if (rows?.length) {
                const user = rows[0];
                const dataToUpdate = [data.email, user.id];
                const column = data.provider === 'google' ? 'gmail' : 'facebook';
                connection.query("UPDATE `character` SET " + column + " = ? WHERE id = ?", dataToUpdate, (error) => {
                  connection.release();

                  if (error) return reject(ErrorBadRequest(`Failed to sign in with ${data.provider}.`));

                  return resolve({
                    status: true,
                    message: "Signed in successfully.",
                  });
                });
              } else {
                connection.release();
                return reject(ErrorBadRequest("Please register."));
              }
            });
          });
        });
      } catch (err) {
        connection.release();
        return reject(ErrorBadRequest(`Failed to sign in with ${data.provider}.`));
      }
    });
  }
};

module.exports = { ...methods };
