const db = require("../models");

exports.UserConfig = async (req, res) => {
    const firebaseUserUid = req.body.firebaseUserUid;

    let estaConfigurado = await VerificaResponsavel(firebaseUserUid);

    if (estaConfigurado) {
        res.send("true");
        return
    } else {
        estaConfigurado = await VerificaIdoso(firebaseUserUid);
    }

    if (estaConfigurado) {
        res.send("true");
    } else {
        res.send("false");
    }

};


// Retorna 1 se encontrar: responsável vinculado a idoso, idoso vinculado a máquina e existir o firebaseUserUid
async function VerificaResponsavel(id) {
    let userConfig = await db.sequelize.query('SELECT EXISTS( SELECT * FROM responsavels RESP INNER JOIN idosos IDS ON IDS.idResp = RESP.id INNER JOIN maquinas MAQ ON MAQ.id = IDS.idMachine WHERE RESP.firebaseUserUid = :id ) AS estaConfigurado;', {
        replacements: { id: id },
        type: db.sequelize.QueryTypes.SELECT
    });

    return userConfig[0].estaConfigurado;
};

//  Retorna 1 se encontrar: idoso vinculado a máquina e existir o firebaseUserUid
async function VerificaIdoso(id) {
    let userConfig = await db.sequelize.query('SELECT EXISTS( SELECT * FROM idosos IDS INNER JOIN maquinas MAQ ON MAQ.id = IDS.idMachine WHERE IDS.firebaseUserUid = :id ) AS estaConfigurado', {
        replacements: { id: id },
        type: db.sequelize.QueryTypes.SELECT
    });

    return userConfig[0].estaConfigurado;
};

