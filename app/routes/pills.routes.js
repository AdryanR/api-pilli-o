module.exports = app => {
  const pills = require("../controllers/pills.controller.js");

  var router = require("express").Router();

  router.post("/create", pills.create);

  router.get("/all", pills.findAll);

  //router.get("/return/:maquina", pills.returnEsp)
  
  router.put("/alter/:id", pills.update);

  router.put("/delete", pills.delete);

  app.use('/api/pills', router);
};
