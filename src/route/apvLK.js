const express = require("express");
const {
	create_apvLK,
	getAPV_LK,
	getDetail_apvLK,
} = require("../controller/APV_LK");

const isAdmin = require("../middleware/isAdmin");
const apvLK_ROUTE = express.Router();
apvLK_ROUTE.post("/apvlk", isAdmin, create_apvLK);
apvLK_ROUTE.get("/apvlk", getAPV_LK);
apvLK_ROUTE.get("/apvlk/:id", getDetail_apvLK);
apvLK_ROUTE.put("/:id");
apvLK_ROUTE.delete("/:id");
module.exports = apvLK_ROUTE;
