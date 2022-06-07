module.exports = app => {
  const machines = require("../controllers/machines.controller.js");

  var router = require("express").Router();

  router.post("/create", machines.create);

  router.get("/all", machines.findAll);

  router.get("/verificaconfig-maq-user/:idMaquina", machines.VerificaConfigMaqUser)

  //router.get("/addMaqResp/:maqid/:respid", machines.addMaqResp) // vincular Maquina C/ Resp.

  app.use('/api/machines', router);
};
