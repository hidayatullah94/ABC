const checkToken = require("../middleware/checkToken");

const express = require("express");
const {
  create_Leasing,
  getByID_Leasing,
  getAll_Leasing,
  update_Leasing,
  list_Leasing,
  //   nonActive_Leasing,
} = require("../controller/Leasing");

const Leasing_Route = express.Router();
Leasing_Route.post("/creat-leasing", checkToken, create_Leasing);
Leasing_Route.get("/getall-leasing", getAll_Leasing);
Leasing_Route.get("/getdetail-leasing/:id", getByID_Leasing);
Leasing_Route.get("/list-leasing", list_Leasing);
Leasing_Route.put("/update-leasing/:id", checkToken, update_Leasing);

module.exports = Leasing_Route;
