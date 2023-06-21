const express = require("express");
const {
  create_cabang,
  update_cabang,
  detail_cabang,
  get_cabang,
  getList_cabang,
} = require("../controller/Cabang");

//route cabang
const CabangRoute = express.Router();
CabangRoute.post("/cabang", create_cabang);
CabangRoute.put("/cabang/:id", update_cabang);
CabangRoute.get("/cabang/:id", detail_cabang);
CabangRoute.get("/cabang", get_cabang);
CabangRoute.get("/cabangs", getList_cabang);

module.exports = CabangRoute;
