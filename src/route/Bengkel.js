const express = require("express");
const {
	create_bengkel,
	update_bengkel,
	detail_bengkel,
	get_bengkel,
	delete_bengkel,
	getList_bengkel,
	filter_bengkel,
	getLaporan,
} = require("../controller/Bengkel");

//route bengkel
const BengkelRoute = express.Router();
BengkelRoute.post("/bengkel", create_bengkel);
BengkelRoute.put("/bengkel/:id", update_bengkel);
BengkelRoute.get("/bengkel/:id", detail_bengkel);
BengkelRoute.get("/bengkel", get_bengkel);
BengkelRoute.get("/bengkels", getList_bengkel);
BengkelRoute.get("/bengkell", filter_bengkel);
BengkelRoute.delete("/bengkel/:id", delete_bengkel);
BengkelRoute.get("/bangke", getLaporan);
module.exports = BengkelRoute;
