const db = require("../models");
const Responsavel = db.responsavel;
const Idoso = db.Idoso;

exports.UserConfig = async (req, res) => {
    const firebaseUserUid = req.body.firebaseUserUid;

    let responsavel = await VerificaResponsavel(firebaseUserUid);

    if (responsavel.id) {
        res.send(responsavel);
        return;
    }

    let idoso = await VerificaIdoso(firebaseUserUid);

    if (idoso) {
        res.send(idoso);
    } else {
        res.send({});
    }
};

async function VerificaResponsavel(id) {
    let resultadoResponsavel = await db.sequelize.query(
        (
            'SELECT RESP.id, RESP.nome, RESP.login FROM responsavels RESP' +
            ' WHERE RESP.firebaseUserUid = :id'
        ),
        {
            replacements: { id: id },
            type: db.sequelize.QueryTypes.SELECT
        },
    );

    let responsavel = resultadoResponsavel[0] || {};

    if (responsavel.id) {
        let idosos = await db.sequelize.query(
            (
                'SELECT IDS.id, IDS.nome, IDS.login FROM idosos IDS' +
                ' INNER JOIN maquinas MAQ ON MAQ.id = IDS.idMachine' +
                ' WHERE IDS.idResp = :idResponsavel'
            ),
            {
                replacements: { idResponsavel: responsavel.id },
                type: db.sequelize.QueryTypes.SELECT
            },
        );

        responsavel.funcao = "responsavel";
        responsavel.idosos = idosos;
    }

    return responsavel;
};

async function VerificaIdoso(id) {
    let resultadoIdoso = await db.sequelize.query(
        (
            'SELECT IDS.id, IDS.nome, IDS.login FROM idosos IDS' +
            ' INNER JOIN maquinas MAQ ON MAQ.id = IDS.idMachine' +
            ' WHERE IDS.firebaseUserUid = :id'
        ),
        {
            replacements: { id: id },
            type: db.sequelize.QueryTypes.SELECT
        },
    );

    let idoso = resultadoIdoso[0] || {};

    if (idoso.id) {
        idoso.funcao = "idoso";
    }

    return idoso;
};

exports.getConfiguracoesByIdoso = async (req, res) => {
    try {
        const idIdoso = req.body.idIdoso;

        const result = await Idoso.findAll({
            raw: true,
            nest: true,
            where: { id: idIdoso },
            include: ["maquinas"]
        });

        const configuracoes = result[0] || {};

        if (configuracoes.idResp) {
            const responsavel = await Responsavel.findByPk(configuracoes.idResp);
            configuracoes.nomeResponsavel = responsavel?.nome;
        }

        res.status(200).send({ configuracoes });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
