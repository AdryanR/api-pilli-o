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
    codigoMaquina: req.body.codigomaquina
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

// Relacionamento entre máquinas e login responsável //

/* exports.addMaqResp = (req, res) => {
  const maqid = req.params.maqid;
  const respid = req.params.respid;
  return Responsavel.findByPk(respid)
    .then((responsavel) => {
      if (!responsavel) {
        console.log("Responsável not found!");
        return null;
      }
      return Machines.findByPk(maqid).then((machine) => {
        if (!machine) {
          console.log("Máquina not found!");
          return null;
        }
        responsavel.addMachine(machine)
        res.send({
          message: "Vinculados!"
        });
        return responsavel;
      });
    })
    .catch((err) => {
      console.log(">> Houve um erro grave no vinculo: ", err);
    });
}; */