const db = require("../models");

const Idoso = db.Idoso;
const Op = db.Sequelize.Op;
const Machines = db.machines;

exports.create = async (req, res) => {
  // Validate request
  if (!req.body.login) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  let idMaq = await CreateMaquina(req.body.codigoMaquina);

  const idoso = {
    nome: req.body.nome,
    login: req.body.login,
    firebaseUserUid: req.body.firebaseUserUid,
    idMachine: idMaq,
  }

  Idoso.create(idoso)
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

async function CreateMaquina(codigoMaquina) {
  let createMaq = await db.sequelize.query('INSERT INTO Maquinas (codigoMaquina) values (:id)', {
    replacements: { id: codigoMaquina },
    type: db.sequelize.QueryTypes.INSERT
  });

  return createMaq[0];
}


exports.findAllByIdoso = (req, res) => {
  const id = req.params.id;

  Idoso.findAll({
    where: { id: id },
    include: ["responsavel", "maquinas", "alarmes"]
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
