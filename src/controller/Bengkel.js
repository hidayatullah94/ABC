const {request, response} = require("express");
const moment = require("moment/moment");
const {Bengkel} = require("../../prisma/conn");

//create post bengkel
const create_bengkel = async (req = request, res = response) => {
	try {
		const {nama, telp, alamat} = await req.body;
		const postBengkel = await Bengkel.create({
			data: {
				nama: nama,
				telp: telp,
				alamat: alamat,
			},
		});
		res.status(201).json({
			succes: true,
			message: "Data Berhasil ditambahkan",
			query: postBengkel,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.stack,
		});
	}
};

//update post bengkel
const update_bengkel = async (req = request, res = response) => {
	try {
		const {id} = await req.params;
		const {nama, telp, alamat} = await req.body;
		const putBengkel = await Bengkel.update({
			where: {
				id: Number(id),
			},
			data: {
				nama: nama,
				telp: telp,
				alamat: alamat,
			},
		});
		res.status(201).json({
			succes: true,
			message: "Data berhasil diupdate",
			query: putBengkel,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

//get detail post bengkel
const detail_bengkel = async (req = request, res = response) => {
	try {
		const {id} = await req.params;
		const getIdBengkel = await Bengkel.findMany({
			where: {
				id: Number(id),
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			query: getIdBengkel,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

//get all bengkel
const get_bengkel = async (req = request, res = response) => {
	try {
		const {limit, page} = await req.query;
		//page
		const skip = (page - 1) * limit;

		const getBengkel = await Bengkel.findMany({
			skip: parseInt(skip),
			take: parseInt(limit),
			orderBy: {
				nama: "asc",
			},
		});
		const countPage = await Bengkel.count();
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			current_page: parseInt(page),
			total_data: countPage,
			total_page: Math.ceil(countPage / limit),
			query: getBengkel,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

//get list bengkel
const getList_bengkel = async (req = request, res = response) => {
	try {
		const getListBengkel = await Bengkel.findMany({
			orderBy: {
				nama: "asc",
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			query: getListBengkel,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};
//delete bengkel
const delete_bengkel = async (req = request, res = response) => {
	try {
		const {id} = await req.params;
		const deleteBengkel = await Bengkel.delete({
			where: {
				id: Number(id),
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil dihapus",
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};
// filter
const filter_bengkel = async (req = request, res = response) => {
	try {
		const {search} = await req.query;
		const filters = await Bengkel.findMany({
			where: {
				nama: search,
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data succes",
			query: filters,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const getLaporan = async (req = request, res = response) => {
	try {
		const {start, end} = await req.query;
		const starts = moment(start).toDate();
		const ends = moment(end).toDate();

		const getlapor = await Bengkel.findMany({
			where: {
				createdAt: {
					gte: starts,
					lte: ends,
				},
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			query: getlapor,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};
module.exports = {
	create_bengkel,
	update_bengkel,
	detail_bengkel,
	get_bengkel,
	delete_bengkel,
	getList_bengkel,
	filter_bengkel,
	getLaporan,
};
