const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  // origin: "https://localhost:8080"
  origin: "https://webclient-pillio.herokuapp.com"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pills application." });
});

require("./app/routes/pills.routes")(app);
require("./app/routes/machines.routes")(app);
require("./app/routes/Resp.routes")(app);
require("./app/routes/idosos.routes")(app);
require("./app/routes/disparos.routes")(app);
require("./app/routes/config.router")(app);


const CronJob = require('cron').CronJob;
const PillsController = require("./app/controllers/pills.controller");
const job = new CronJob('0 * * * * *', () => {
  PillsController.returnEsp();
}, null, true, 'America/Sao_Paulo')


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
