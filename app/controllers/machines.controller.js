const db = require("../models");
const Machines = db.machines;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.codigoMaquina) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const machines = {
    codigoMaquina: req.body.codigomaquina,
    qtdeCompartimentos: req.body.qtdeCompartimentos
  }

  Machines.create(machines)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Pills."
      });
    });
};

exports.findAll = (req, res) => {

  Machines.findAll()
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


// endpoint usado pelo dispenser para verificar se foi configurado para um user
exports.VerificaConfigMaqUser = async (req, res) => {
  const idMaquina = req.params.idMaquina;

  let configExists = await db.sequelize.query('SELECT EXISTS( SELECT * FROM idosos IDS INNER JOIN maquinas MAQ ON MAQ.id = IDS.idMachine WHERE MAQ.codigoMaquina = :id ) AS estaConfigurado', {
    replacements: { id: idMaquina },
    type: db.sequelize.QueryTypes.SELECT
  });

  if (configExists[0].estaConfigurado) {
    res.send("true");
  } else {
    res.send("false");
  }
};

// usado pra retornar os comps em uso
exports.getCompartimentosByIdoso = async (req, res) => {
  try {
    const idIdoso = req.params.idIdoso;

    let search = await db.sequelize.query('SELECT (SELECT GROUP_CONCAT(compartimentos) FROM agendas WHERE idIdoso = :id and excluido = 0 and ativo = 1 ) AS compartimentosEmUso, qtdeCompartimentos FROM maquinas limit 1', {
      replacements: { id: idIdoso },
      type: db.sequelize.QueryTypes.SELECT
    });

    let {
      compartimentosEmUso,
      qtdeCompartimentos
    } = search[0] || {};

    let compsUsadosArray = compartimentosEmUso?.split(",") || [];

    const retorno = {
      qtdeCompartimentos,
      compartimentosEmUso: compsUsadosArray
    }

    if (retorno) {
      res.send(retorno);
    } else {
      res.send({});
    }
  } catch (error) {
    res.status(500).send(`Erro ao obter compartimentos do Dispenser: ${error}`);
  }
}
