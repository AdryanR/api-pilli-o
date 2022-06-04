const db = require("../models");
const Pills = db.pills;
const Disparos = db.disparo;
const Idosos = db.Idoso;
const Alarmes = db.pills;
const Maquinas = db.machines;
//const mqttServer = require("../config/mqtt.config.js");
const mqtt = require('mqtt')
//const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.nomeRemedio) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const pills = {
    nomeRemedio: req.body.nomeRemedio,
    dataInicio: req.body.dataInicio,
    horaInicio: req.body.horaInicio,
    qtdeVezesRepetir: req.body.qtdeVezesRepetir,
    repetirEmQuantasHoras: req.body.repetirEmQuantasHoras,
    ativo: req.body.ativo,
    excluido: req.body.excluido,
    idIdoso: req.body.ididoso,
    compartimento: req.body.compartimento
  }

  Pills.create(pills)
    .then(data => {
      res.send(data);
      PrimeiroDisparoByAlarme({ id: data.id, dataInicio: pills.dataInicio, horaInicio: pills.horaInicio })
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

// recebe o código da máquina que vai verificar se há alarme...
exports.returnEsp = async () => {
  let maquinas = await Maquinas.findAll();
  const jsonMaquinas = JSON.parse(JSON.stringify(maquinas));

  for (let m of jsonMaquinas) {
    const resultados = await buscaDisparosByMaquina(m.id)

    const jsonDisparo = JSON.parse(JSON.stringify(resultados));


    for (let disparo of jsonDisparo) {
      let dataFinal = disparo.dataDisparo.substr(0, 11) + disparo.horaDisparo
      let dataPills = new Date(dataFinal)
      let dataAtual = new Date()
      dataPills.setSeconds(0)
      dataPills.setMilliseconds(0)
      dataAtual.setSeconds(0)
      dataAtual.setMilliseconds(0)
      if (dataPills.toLocaleString() === dataAtual.toLocaleString()) {

        let compartimento = await FauxiliarAlarme(disparo.idAlarme, disparo.dataDisparo, disparo.horaDisparo)

        await RequestMQTT(m.id_maq, disparo.id, compartimento, disparo.idAlarme, disparo.horaDisparo);
        console.log("DISPAROU DATA E HORA IGUAIS")
        break
      }
    }
  }
  //res.send(retorno)
  console.log("disparou...")

  //await RequestMQTT(30, 0, 0); //testes

};


async function RequestMQTT(maquina, idDisparo, compartimento, idAlarme, horaDisparo) {

  const host = 'xaf606cf.us-east-1.emqx.cloud'
  const port = '15118'
  const clientId = `mqttServerAPI`

  const connectUrl = `mqtt://${host}:${port}`
  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'admin',
    password: 'a%!undQWy7ys',
    //reconnectPeriod: 1000,
  }) 

  let maqString = maquina + '';
  let idDisparoString = idDisparo + '';
  let compartimentoString = compartimento + '';
  let retorno = '{"resposta": "Sim",' + '"idDisparo":' + idDisparoString + ',"compartimento":' + compartimentoString + '}';

  let alarme = await Alarmes.findByPk(idAlarme)
  let idoso = await Idosos.findByPk(alarme.idIdoso)
  
  let doseString = alarme.qtdeVezesRepetir + '';
  let idIdosoString = alarme.idIdoso + '';
  let idAlarmeString = idAlarme + '';
  let topicoNotifacacao = "api/elderly/" + idIdosoString + "/alarm/notification"

  let notificacao = '{"idIdoso":' + idIdosoString + ',"nomeIdoso":' + idoso.nome + ',"nomeRemedio":' + alarme.nomeRemedio + ',"compartimento":' + compartimentoString + ',"QtdeTomar":' + doseString + ',"horaDisparo":' + horaDisparo + ',"idAlarme":' + idAlarmeString + '}';
  client.on('connect', () => {
    console.log('Connected')
    client.publish(maqString, retorno, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
    client.publish(topicoNotifacacao, notificacao, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
      client.end();
    })
  })
}


async function buscaDisparosByMaquina(maquina) {
  let idoso = await Idosos.findOne({
    where: {
      idMachine: maquina
    }
  });

  let disparos = await db.sequelize.query('SELECT * FROM disparoagendas WHERE idAlarme IN (SELECT `id` FROM `AGENDAs` AS `AGENDA` WHERE `AGENDA`.`ativo` = 1 AND `AGENDA`.`idIdoso` = (:id) )', {
    replacements: { id: idoso.id },
    type: db.sequelize.QueryTypes.SELECT
  });

  return disparos

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

async function FauxiliarAlarme(idAlarme, dataDisparo, horaDisparo) {
  let alarme = await Alarmes.findByPk(idAlarme)
  await AlterByDose({ id: alarme.id, qtdeVezesRepetir: alarme.qtdeVezesRepetir })
  await CreateProximoDisparo(idAlarme, dataDisparo, horaDisparo, alarme.repetirEmQuantasHoras)
  return alarme.compartimento
};

async function AlterByDose(alarme) {
  const dose = alarme.qtdeVezesRepetir - 1;
  if (dose === 0) {
    alarme.ativo = 0;
    alarme.qtdeVezesRepetir = dose;

  } else {
    alarme.qtdeVezesRepetir = dose;
  }

  await Pills.update(alarme, { where: { id: alarme.id } });
}

// cria o PRIMEIRO disparo para um novo alarme definido...
async function PrimeiroDisparoByAlarme(alarme) {

  await Disparos.create({
    dataDisparo: alarme.dataInicio,
    horaDisparo: alarme.horaInicio,
    tomouRemedio: 0,
    idAlarme: alarme.id,
  })

}

// calcula e cria o proximo disparo mediante o disparo anterior de um alarme e a x de repetição.
async function CreateProximoDisparo(idAlarme, dataDisparo, horaDisparo, repeticao) {
  let dataString = dataDisparo.substr(0, 11) + horaDisparo
  let dataDisparoAnterior = new Date(dataString)
  let ProximoDisparo = dataDisparoAnterior
  ProximoDisparo.setHours(dataDisparoAnterior.getHours() + repeticao);

  console.log("proximo disparo: " + ProximoDisparo)

  const formataData = (datetime) => {
    if (datetime.getDate() <= 10) {
      let formatted_date = datetime.getFullYear() + "-0" + (datetime.getMonth() + 1) + "-0" + datetime.getDate() + " " + datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds();
      return formatted_date;
    } else {
      let formatted_date = datetime.getFullYear() + "-0" + (datetime.getMonth() + 1) + "-" + datetime.getDate() + " " + datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds();
      return formatted_date;
    }
  }

  let dataFormatada = formataData(ProximoDisparo)
  console.log("data formatada: " + dataFormatada)
  let novaData = dataFormatada.substring(0, 10);
  let novaHora = dataFormatada.substring(11, 18);

  await Disparos.create({
    dataDisparo: novaData,
    horaDisparo: novaHora,
    tomouRemedio: 0,
    idAlarme: idAlarme,
  })

}


