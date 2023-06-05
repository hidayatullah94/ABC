const express = require("express");
const {
	getall_LPLK,
	getLaporan_detail,
	getLaporanPart,
	getall_cabang,
} = require("../controller/LP_lk");
const checkToken = require("../middleware/checkToken");
const LPLK_ROUTE = express.Router();

LPLK_ROUTE.get("/lpcabang", checkToken, getall_cabang);
LPLK_ROUTE.get("/lplk", checkToken, getall_LPLK);
LPLK_ROUTE.get("/laporan", checkToken, getLaporan_detail);
LPLK_ROUTE.get("/laporanpart", getLaporanPart);

module.exports = LPLK_ROUTE;
