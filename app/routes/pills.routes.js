module.exports = app => {
  const pills = require("../controllers/pills.controller.js");

  var router = require("express").Router();

  router.post("/create", pills.create);

  router.get("/all", pills.findAll);

  router.get("/esp", pills.returnEsp)
  
  router.put("/alter/:id", pills.update);

  //  router.get("/AlterByDose/:id", pills.AlterByDose);

  router.get("/CreateOneDisparoByAlarme/:id", pills.CreateOneDisparoByAlarme);

  router.get("/CreateProximoDisparo", pills.CreateProximoDisparo)

  router.delete("/delete/:id", pills.delete);

  app.use('/api/pills', router);
};
