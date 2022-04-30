module.exports = app => {
  const machines = require("../controllers/machines.controller.js");

  var router = require("express").Router();

  router.post("/create", machines.create);

  router.get("/all", machines.findAll);

  app.use('/api/machines', router);
};
