const db = require("../models");
const Machines = db.machines;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.data) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const machines = {
    id_maq: req.body.id_maq,
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
};;
