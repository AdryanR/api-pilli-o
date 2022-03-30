const db = require("../models");
const Pills = db.pills;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.data) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const pills = {
    data: req.body.data,
    hora: req.body.hora,
    repetir: req.body.repetir,
    status:  req.body.status
}

  Pills.create(pills)
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
  
  Pills.findAll()
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

exports.returnEsp = (req, res) => {
  
  Pills.findAll()
  .then(data => {
    const jsonData = JSON.parse(JSON.stringify(data))
    let ret = "Não"
    for (var i = 0; i < jsonData.length; i++) {
      let dataFinal = jsonData[i].data.substr(0, 11) + jsonData[i].hora
      let dataPills = new Date(dataFinal)
      let dataAtual = new Date()
      dataPills.setSeconds(0)
      dataPills.setMilliseconds(0)
      dataAtual.setSeconds(0)
      dataAtual.setMilliseconds(0)
      if(dataPills.toLocaleString() === dataAtual.toLocaleString() && (parseInt(jsonData[i].status) === 1)){
           ret = "Sim"
           break
      }     
   }
    res.send([{message: ret}])
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving pills."
    });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Pills.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Agenda was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Agenda with id=${id}. Maybe Agenda was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Agenda with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Pills.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Agenda was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Agenda with id=${id}. Maybe Agenda was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Agennda with id=" + id
      });
    });
};
