const express = require("express");
const {
	createapv_SPK,
	getAll_apvSPK,
	getDetail_apvSPK,
} = require("../controller/APV_SPK");
const checkToken = require("../middleware/checkToken");
const isManager = require("../middleware/isManager");
const APV_SPK = express.Router();
APV_SPK.post("/apvspk", isManager, createapv_SPK);
APV_SPK.get("/apvspk", checkToken, getAll_apvSPK);
APV_SPK.get("/apvspk/:id", checkToken, getDetail_apvSPK);
APV_SPK.put("/:id");
APV_SPK.delete("/:id");
module.exports = APV_SPK;
