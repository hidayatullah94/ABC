const express = require("express");
const {
	create_LK,
	get_LK,
	getDetail_LK,
	update_LK,

	get_LKbyCabang,
} = require("../controller/LK");
const checkToken = require("../middleware/checkToken");

const LkRoute = express.Router();
LkRoute.post("/lk", checkToken, create_LK);
//admin
LkRoute.get("/lk", checkToken, get_LK);
//user
LkRoute.get("/lk/user", checkToken, get_LKbyCabang);

LkRoute.get("/lk/:id", checkToken, getDetail_LK);
LkRoute.put("/lk/:id", checkToken, update_LK);

module.exports = LkRoute;
