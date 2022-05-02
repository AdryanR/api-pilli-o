module.exports = app => {
  const idoso = require("../controllers/idosos.controller.js");

  var router = require("express").Router();

  router.post("/create", idoso.create);

  router.get("/all", idoso.findAll);

  router.post("/auth", idoso.auth);

  router.get("/findallbyidoso/:id", idoso.findAllByIdoso);

  app.use('/api/idosos', router);
};
