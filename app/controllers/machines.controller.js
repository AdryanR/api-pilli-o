const db = require("../models");
const Machines = db.machines;
const Responsavel = db.responsavel;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.id_maq) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const machines = {
    id_maq: req.body.id_maq,
    LoginId: req.body.LoginId
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