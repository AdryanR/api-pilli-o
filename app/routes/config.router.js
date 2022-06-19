module.exports = app => {
    const config = require("../controllers/config.controller.js");

    var router = require("express").Router();

    router.post("/usuario-esta-configurado", config.UserConfig);

    router.post("/get-configuracoes-idoso", config.getConfiguracoesByIdoso);

    app.use('/api/config/', router);
};