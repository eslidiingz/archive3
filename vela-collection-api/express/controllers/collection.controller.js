const Service = require("../services/collection.service");

const methods = {
  async onGetAll(req, res) {
    try {
      const result = await Service.find(req);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onGetById(req, res) {
    try {
      const result = await Service.findById(req.params.id);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onInsert(req, res) {
    // console.log(req)
    try {
      const { id } = req.file;
      const { title, description, owner } = req.body;

      const data = { title, description, owner, cover: id };
      const result = await Service.insert(data);
      res.success(result, 201);
    } catch (error) {
      res.error(error);
    }
  },

  async onUpdate(req, res) {
    try {
      const result = await Service.update(req.params.id, req.body);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onDelete(req, res) {
    try {
      await Service.delete(req.params.id);
      res.success("success", 204);
    } catch (error) {
      res.error(error);
    }
  },

  async onUpdateHolder(req, res) {
    try {
      const result = await Service.updateHolder(req.params.id, req.body);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onUpdateTransaction(req, res) {
    try {
      const result = await Service.updateTransaction(req.params.id, req.body);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onUpdateAssets(req, res) {
    try {
      const result = await Service.updateAssets(req.params.id, req.body);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },

  async onFindCollectionByAsset(req, res) {
    try {
      const result = await Service.findCollectionByAsset(req.params.id);
      res.success(result);
    } catch (error) {
      res.error(error);
    }
  },
};

module.exports = { ...methods };
