const db = require("../models");
const Pills = db.pills;
const Disparos = db.disparo;
const Idosos = db.Idoso;
const Alarmes = db.pills;
const Maquinas = db.machines;
const mqtt = require('mqtt')

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
    compartimentos: req.body.compartimentos
  }

  Pills.create(pills)
    .then(data => {
      res.send(data);
      PrimeiroDisparoByAlarme({ id: data.id, dataInicio: pills.dataInicio, horaInicio: pills.horaInicio, compartimentos: pills.compartimentos })
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

        await FauxiliarAlarme(disparo.idAlarme, disparo.dataDisparo, disparo.horaDisparo)

        // envia dados para o dispenser
        let topicoDispenser = m.codigoMaquina + '';
        let msgDispenser = '{"resposta": "Sim",' + '"idDisparo":' + disparo.id + ',"compartimento":' + disparo.compartimento + '}';
        await RequestMQTT(topicoDispenser, msgDispenser);

        // envia notificao pro idoso
        let alarme = await Alarmes.findByPk(disparo.idAlarme)
        let idoso = await Idosos.findByPk(alarme.idIdoso)
        let topicoNotifacacaoIdoso = "api/elderly/" + alarme.idIdoso + "/alarm/notification"

        let notificacaoIdoso = '{"idIdoso":' + alarme.idIdoso + ',"nomeIdoso":' + idoso.nome + ',"nomeRemedio":' + alarme.nomeRemedio + ',"compartimento":' + disparo.compartimento + ',"QtdeTomar":' + alarme.qtdeVezesRepetir + ',"horaDisparo":' + disparo.horaDisparo + ',"idAlarme":' + disparo.idAlarme + '}';
        await RequestMQTT(topicoNotifacacaoIdoso, notificacaoIdoso);
        setTimeout( async () => (await VerificaTomouRemedio(disparo, alarme, idoso)), 180000);
        break
      }
    }
  }

  console.log("disparou...")

};


async function RequestMQTT(topico, mensagem) {

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

  client.on('connect', () => {
    console.log('Connected')
    client.publish(topico, mensagem, { qos: 0, retain: false }, (error) => {
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
        message: "Could not delete Agenda with id=" + id
      });
    });
};

async function FauxiliarAlarme(idAlarme, dataDisparo, horaDisparo) {
  let alarme = await Alarmes.findByPk(idAlarme)
  let ProximoComp = await AlterByMetodoUso({ id: alarme.id, qtdeVezesRepetir: alarme.qtdeVezesRepetir, compartimentos: alarme.compartimentos })
  if (ProximoComp !== 0) {
    await CreateProximoDisparo(idAlarme, dataDisparo, horaDisparo, alarme.repetirEmQuantasHoras, ProximoComp)
  }
};

async function AlterByMetodoUso(alarme) {

  let resultados = await db.sequelize.query('SELECT disparo.compartimento, agenda.qtdeVezesRepetir, agenda.compartimentos FROM disparoagendas disparo INNER JOIN agendas agenda ON agenda.id = :id WHERE disparo.idAlarme = :id order by disparo.createdAt desc limit 1', {
    replacements: { id: alarme.id },
    type: db.sequelize.QueryTypes.SELECT
  });

  console.log(resultados)
  let qtdeDoses = resultados[0].qtdeVezesRepetir
  let compartimentos = resultados[0].compartimentos
  let ultimoComp = resultados[0].compartimento

  const qtdCompartimentos = compartimentos.split(",").length
  const comps = compartimentos.split(",");

  if (qtdeDoses > 1 && qtdCompartimentos === 1) {
    await AlterByDose({ id: alarme.id, qtdeVezesRepetir: alarme.qtdeVezesRepetir })
    let compDisparo = comps[0];
    return compDisparo
  }

  else if (qtdeDoses === qtdCompartimentos) {
    let indiceDoValorDoUltimoComp = comps.indexOf(ultimoComp.toString(), 0)
    let valorProximoCompartimento = comps[indiceDoValorDoUltimoComp + 1];
    console.log("proximo comp::: ")
    console.log(valorProximoCompartimento)
    const dose = alarme.qtdeVezesRepetir - 1;
    if (dose === 0) {
      alarme.ativo = 0;
      alarme.qtdeVezesRepetir = dose;

    } else {
      alarme.qtdeVezesRepetir = dose;
    }
    comps.splice(indiceDoValorDoUltimoComp, 1)
    let compsString = comps.toString();
    console.log("novos comps::: ")
    console.log(compsString)
    alarme.compartimentos = compsString;
    await Pills.update(alarme, { where: { id: alarme.id } });

    if (dose !== 0) {
      return valorProximoCompartimento
    }
    else {
      let retorno = 0
      return retorno
    }
  }
}

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

// verifica se idoso tomou remedio e envia notificacao
async function VerificaTomouRemedio(disparo, alarme, idoso) {

  console.log("Entrou na VerificaTomouRemedio")
  let retorno = await db.sequelize.query('select tomouRemedio from disparoagendas where id = :id', {
    replacements: { id: disparo.id },
    type: db.sequelize.QueryTypes.SELECT
  });

  if (!retorno[0].tomouRemedio) {
    // envia notificao que ainda não tomou remedio pro idoso
    let topicoNotifacacaoIdoso = "api/elderly/" + alarme.idIdoso + "/alarm/notification/notake"

    let notificacao = '{"idIdoso":' + alarme.idIdoso + ',"nomeIdoso":' + idoso.nome + ',"nomeRemedio":' + alarme.nomeRemedio + ',"compartimento":' + disparo.compartimento + ',"QtdeTomar":' + alarme.qtdeVezesRepetir + ',"horaDisparo":' + disparo.horaDisparo + ',"idAlarme":' + disparo.idAlarme + '}';
    await RequestMQTT(topicoNotifacacaoIdoso, notificacao);

    if (idoso.idResp > 0){
    // envia notificao pro responsável do idoso que ainda não tomou o remedio
    let topicoNotifacacaoResponsavel = "api/responsible/" + idoso.idResp + "/alarm/notification/notake"

    await RequestMQTT(topicoNotifacacaoResponsavel, notificacao);
    }
  }

}

// cria o PRIMEIRO disparo para um novo alarme definido...
async function PrimeiroDisparoByAlarme(alarme) {

  let comps = alarme.compartimentos.split(",");
  let primeiroComp = comps[0];

  await Disparos.create({
    dataDisparo: alarme.dataInicio,
    horaDisparo: alarme.horaInicio,
    tomouRemedio: 0,
    compartimento: primeiroComp,
    idAlarme: alarme.id,
  })

}

// calcula e cria o proximo disparo mediante o disparo anterior de um alarme e a x de repetição.
async function CreateProximoDisparo(idAlarme, dataDisparo, horaDisparo, repeticao, ProximoComp) {
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
    compartimento: ProximoComp,
    idAlarme: idAlarme,
  })

}


