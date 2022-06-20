module.exports = app => {
  const idoso = require("../controllers/idosos.controller.js");

  var router = require("express").Router();

  router.post("/create", idoso.create);

  router.put("/update/:id", idoso.update);

  router.post("/delete", idoso.delete);

  // router.get("/all", idoso.findAll);

  router.get("/findallbyidoso/:id", idoso.findAllByIdoso);

  app.use('/api/idosos', router);
};
