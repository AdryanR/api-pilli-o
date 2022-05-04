module.exports = app => {
  const disparo = require("../controllers/disparos.controller.js");

  var router = require("express").Router();

  router.post("/create", disparo.create);

  router.put("/alter/:id", disparo.update);

  router.get("/findDisparoByAlarme/:id", disparo.findDisparoByAlarme);

  app.use('/api/disparos', router);
};
