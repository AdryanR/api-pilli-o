module.exports = app => {
  const pills = require("../controllers/pills.controller.js");

  var router = require("express").Router();

  router.post("/create", pills.create);

  router.get("/all", pills.findAll);

  router.get("/esp", pills.returnEsp)
  
  router.put("/alter/:id", pills.update);

  router.delete("/delete/:id", pills.delete);

  app.use('/api/pills', router);
};
