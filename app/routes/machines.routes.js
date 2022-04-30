module.exports = app => {
  const machines = require("../controllers/machines.controller.js");

  var router = require("express").Router();

  router.post("/create", machines.create);

  app.use('/api/machines', router);
};