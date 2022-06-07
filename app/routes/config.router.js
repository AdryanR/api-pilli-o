module.exports = app => {
    const config = require("../controllers/config.controller.js");

    var router = require("express").Router();

    router.post("/usuario-esta-configurado", config.UserConfig);

    app.use('/api/config/', router);
};