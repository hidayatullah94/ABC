const express = require("express");
const {
	create_service,
	get_alldata,
	getDetail_service,
	getBycabang,
} = require("../controller/Service");
const checkToken = require("../middleware/checkToken");
const uploadServis = require("../middleware/uploadServis");
const ServiceRoute = express.Router();
ServiceRoute.post(
	"/service",
	uploadServis.single("img"),
	checkToken,
	create_service
);
ServiceRoute.get("/service", checkToken, get_alldata);
ServiceRoute.get("/service/:id", checkToken, getDetail_service);
ServiceRoute.get("/servis/user", checkToken, getBycabang);

module.exports = ServiceRoute;
