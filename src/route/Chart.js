const express = require("express");
const { PieChart, Cabang, PieChart_cabang } = require("../controller/Chart");
const checkToken = require("../middleware/checkToken");
const ChartRoute = express.Router();

ChartRoute.get("/piechart", checkToken, PieChart);
ChartRoute.get("/areachart", Cabang);
ChartRoute.get("/piecabang", checkToken, PieChart_cabang);

module.exports = ChartRoute;
