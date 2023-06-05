const express = require("express");
const {
  create_unit,
  update_unit,
  detail_unit,
  get_unit,
  getLis_unit,
  delete_unit,
  getListAll_unit,
  get_unitUser,
  getUnit_part,
  getDetail_part,
  unit_Leasing,
} = require("../controller/Unit");
const checkToken = require("../middleware/checkToken");
const uploadUnit = require("../middleware/uploadUnit");

const UnitRoute = express.Router();
//ADMIN
UnitRoute.post("/unit", uploadUnit.single("photo"), create_unit);
UnitRoute.put("/unit/:id", uploadUnit.single("photo"), update_unit);
UnitRoute.get("/unit", checkToken, get_unit);
UnitRoute.get("/unit/all", getListAll_unit);
UnitRoute.get("/unit/part", getUnit_part);
UnitRoute.get("/unit/detailpart", getDetail_part);

//USER
UnitRoute.get("/unitss", checkToken, get_unitUser);
UnitRoute.get("/units", checkToken, getLis_unit);

UnitRoute.get("/unit/:id", detail_unit);
UnitRoute.delete("/unit/:id", delete_unit);
UnitRoute.get("/unit-leasing", unit_Leasing);

module.exports = UnitRoute;
