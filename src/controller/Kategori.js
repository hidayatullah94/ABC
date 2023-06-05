const { request, response } = require("express");
const { Kategori } = require("../../prisma/conn");

const create_kategori = async (req = request, res = response) => {
	try {
		const { nama } = await req.body;
		const postKategori = await Kategori.create({
			data: {
				nama,
			},
		});
		res.status(201).json({
			succes: true,
			message: "Data berhasil dibuat",
			query: postKategori,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const update_kategori = async (req = request, res = response) => {
	try {
		const { id } = await req.params;
		const { nama } = await req.body;
		const putKategori = await Kategori.update({
			where: {
				id: Number(id),
			},
			data: {
				nama,
			},
		});
		res.status(201).json({
			succes: true,
			message: "Data berhasil diupdate",
			query: putKategori,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const get_kategori = async (req = request, res = response) => {
	try {
		const getKategori = await Kategori.findMany();
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			query: getKategori,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};
module.exports = { create_kategori, update_kategori, get_kategori };
