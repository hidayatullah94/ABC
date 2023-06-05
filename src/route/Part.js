const express = require("express");
const {
	create_part,
	get_part,
	detail_part,
	update_part,
	delete_part,
} = require("../controller/Part");

const PartRoute = express.Router();

PartRoute.post("/part", create_part);
PartRoute.get("/part", get_part);
PartRoute.get("/part/:id", detail_part);
PartRoute.put("/part/:id", update_part);
PartRoute.delete("/part/:id", delete_part);
module.exports = PartRoute;
