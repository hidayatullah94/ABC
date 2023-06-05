const express = require("express");
const {
	create_kategori,
	update_kategori,
	get_kategori,
} = require("../controller/Kategori");
const KategoriRoute = express.Router();
KategoriRoute.post("/kategori", create_kategori);
KategoriRoute.put("/kategori/:id", update_kategori);
KategoriRoute.get("/kategori", get_kategori);

module.exports = KategoriRoute;
