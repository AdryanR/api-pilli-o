const db = require("../models");

const Idoso = db.Idoso;
const Pills = db.pills;
const Responsavel = db.responsavel;
const Maquinas = db.machines;

exports.create = async (req, res) => {
  try {
    // Validate request
    if (!req.body.login) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    let idMaq;

    if (req.body.codigoMaquina) {
      let qtdePadraoCompartimentos = 15;

      idMaq = await CreateMaquina(
        req.body.codigoMaquina,
        req.body.qtdeCompartimentos || qtdePadraoCompartimentos,
        req.body.nomeRedeWifiConectada || "",
      );
    }

    const idoso = {
      nome: req.body.nome,
      login: req.body.login,
      codigoAcesso: req.body.codigoAcesso,
      firebaseUserUid: req.body.firebaseUserUid,
      telefone: req.body.telefone,
      idMachine: idMaq,
    }

    if (req.body.idResp) {
      idoso.idResp = req.body.idResp;
    }

    const result = await Idoso.create(idoso);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

async function CreateMaquina(codigoMaquina, qtdeCompartimentos, nomeRedeWifiConectada) {
  let createMaq = await db.sequelize.query('INSERT INTO Maquinas (codigoMaquina, qtdeCompartimentos, nomeRedeWifiConectada) values (:id, :qtdeCompartimentos, :nomeRedeWifiConectada)', {
    replacements: { id: codigoMaquina, qtdeCompartimentos: qtdeCompartimentos, nomeRedeWifiConectada },
    type: db.sequelize.QueryTypes.INSERT
  });

  return createMaq[0];
}

exports.findAllByIdoso = (req, res) => {
  const id = req.params.id;

  Idoso.findAll({
    where: { id: id },
    include: {
      model: Maquinas,
      as: 'maquinas',
      model: Responsavel,
      as: 'responsavel',
      model: Pills,
      as: 'alarmes',
      where: {
        excluido: 0
      },
    }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving pills."
      });
    });
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    await Idoso.update(req.body, { where: { id } });

    res.status(200).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const idIdosos = req.body.idIdosos || [];

    for (const idIdoso of idIdosos) {
      const result = await db.sequelize.query(`
          SELECT
          agendas.id idAlarme, disparoagendas.id idDisparo, maquinas.id idDispenser
          FROM idosos
          LEFT JOIN agendas on idosos.id = agendas.idIdoso
          LEFT JOIN disparoagendas on agendas.id = disparoagendas.idAlarme
          LEFT JOIN maquinas on idosos.idMachine = maquinas.id
          WHERE idosos.id = :id
        `, {
          raw: true,
          nest: true,
          replacements: { id: idIdoso },
          type: db.sequelize.QueryTypes.SELECT
        },
      );

      if (result?.length) {
        const idDisparos = result.reduce((acc, curr) => (curr.idDisparo && !acc.includes(curr.idDisparo) ? [...acc, curr.idDisparo] : acc), []);
        const idAlarmes = result.reduce((acc, curr) => (curr.idAlarme && !acc.includes(curr.idAlarme) ? [...acc, curr.idAlarme] : acc), []);
        const idDispenser = result[0].idDispenser;

        if (idDisparos.length) {
          await db.sequelize.query(`DELETE FROM disparoagendas WHERE id IN (:ids)`, {
            replacements: { ids: idDisparos.join(", ") },
            type: db.sequelize.QueryTypes.DELETE
          });
        }
        
        if (idAlarmes.length) {
          await db.sequelize.query(`DELETE FROM agendas WHERE id IN (:ids)`, {
            replacements: { ids: idAlarmes.join(", ") },
            type: db.sequelize.QueryTypes.DELETE
          });
        }

        if (idDispenser) {
          await db.sequelize.query(`DELETE FROM maquinas WHERE id = :id`, {
            replacements: { id: idDispenser },
            type: db.sequelize.QueryTypes.DELETE
          });
        }

        await db.sequelize.query(`DELETE FROM idosos WHERE id = :id`, {
          replacements: { id: idIdoso },
          type: db.sequelize.QueryTypes.DELETE
        });
      }
    }

    res.status(200).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
