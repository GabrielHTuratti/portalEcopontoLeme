// server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
  const ecoponto = {
    nome: "Ecoponto Ribeirão do Meio",
    lat: -22.188,
    lng: -47.395,
    endereco: "Final da Av. Sete de Setembro, Ribeirão do Meio",
    horario: "Seg-Sáb: 8h-17h"
  };

  const pevs = [
    { nome: "PEV Centro", lat: -22.185, lng: -47.385, tipo: "Recicláveis" },
    { nome: "PEV Jardim São Manoel", lat: -22.170, lng: -47.390, tipo: "Recicláveis" }
  ];

  res.render("home", { ecoponto, pevs });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

module.exports = app;