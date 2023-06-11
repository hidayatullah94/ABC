const {
  create_Tahapan,
  create_NewCicilan,
  create_Pembayaran,
  getAll_UnitLeasing,
  getAll_Cicilan,
  detail_UnitLeasing,
  getAll_Pembayaran,
  detail_pembayaran,
  app_pembayaran,
  notif_UnitLeasing,
  getTempo_Unitleasing,
} = require("../controller/Cicilan");
const checkToken = require("../middleware/checkToken");

const express = require("express");
const Cicilan_Route = express.Router();

//!NEW SKEMA
Cicilan_Route.post("/creat-tahapan", create_Tahapan);
Cicilan_Route.post("/creat-cicilan", checkToken, create_NewCicilan);
Cicilan_Route.post("/creat-pembayaran", checkToken, create_Pembayaran);
Cicilan_Route.get("/unit-pembayaran", getAll_UnitLeasing);
Cicilan_Route.get("/all-cicilan", getAll_Cicilan);
Cicilan_Route.get("/detail-unitleasing/:id", detail_UnitLeasing);
Cicilan_Route.get("/all-pembayaran", getAll_Pembayaran);
Cicilan_Route.get("/detail-pembayaran/:id", detail_pembayaran);
Cicilan_Route.put("/app-pembayaran/:id", checkToken, app_pembayaran);
Cicilan_Route.get("/notif-unitleasing", notif_UnitLeasing);
Cicilan_Route.get("/tempo-unitleasing", getTempo_Unitleasing);

module.exports = Cicilan_Route;
