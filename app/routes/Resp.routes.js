module.exports = app => {
  const resp = require("../controllers/resp.controller.js");

  var router = require("express").Router();

  router.post("/create", resp.create);

  router.get("/all", resp.findAll);

  router.post("/auth", resp.auth);

  router.get("/findidosobyresp/:id", resp.findIdosoByResp);

  app.use('/api/resp', router);
};
