# API - Pilli-o

API desenvolvida para um sistema onde o cuidador de idosos e seus idosos pode registrar e acompanhar alarmes para tratamentos medicamentosos.

A API entrega todos os endpoints para o sistema além de fazer verificações continuas dos disparos dos alarmes e comunicação MQTT com o dispenser e o sistema.

## Funcionalidades

- CRUD
- Comunicação MQTT
- Verificação contínua dos alarmes
- Etc

## Stack utilizada

- Node, Express, Sequelize, [Mqtt](https://mqtt.org/)

## Projeto
Esta aplicação back-end faz parte de um projeto onde trabalhei com mais três pessoas: [Gabriel](https://github.com/mogba) , [Paloma](https://github.com/Paloma-Marian) e [Ricardo](https://github.com/ricardo-14).<br>
<b>O front-end pode ser [acessado aqui](https://github.com/mogba/pillio)</b><br>
<b>O back-end pode ser [acessado aqui](https://github.com/AdryanR/api-pilli-o)</b><br>
<b>O código do Dispenser pode ser [acessado aqui](https://github.com/AdryanR/dispenser-pilli-o)</b>

Para exemplificar as funções, prints do front-end:
<p align="center">
  <img
    width="25%"
    alt="sistema-menu"
    src="https://user-images.githubusercontent.com/56984939/175789879-7a5b88ee-ef67-45d5-9a8e-725dedd27fea.png"
  >
  <img
    width="25%"
    alt="sistema-home"
    src="https://user-images.githubusercontent.com/56984939/175789890-57a6b942-bfe5-49fc-9fce-2063fb71211b.png"
  >
  <img
    width="25%"
    alt="app-edit-alarm"
    src="https://user-images.githubusercontent.com/56984939/175789908-1a444535-4eae-4da8-bb2e-7659db9ba412.png"
  >
</p>

O sistema funciona em conjunto com um dispensador de comprimidos automatizado, construído com sistemas embarcados.

O dispensador tem 15 compartimentos utilizáveis para colocar medicamentos. Também possui na tampa um mecanismo que registra quando um idoso retira o medicamento do aparelho, para criar a tela de histórico do alarme (tomado ou não).

<p align="center">
  <img
    width="35%"
    alt="Dispenser prototype with circular shape"
    src="https://user-images.githubusercontent.com/56984939/175790549-d4c8776e-41c4-46e5-bc72-2e3f99bc8b58.png"
  >
</p>

## Project setup
```
npm install
```

### Run
```
node server.js
```
