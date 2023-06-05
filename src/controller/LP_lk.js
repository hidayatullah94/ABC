// SELECT * FROM `lk` WHERE createdAt >= '2022-12-01' AND createdAt <= '2022-12-31';
const { request, response } = require("express");
const moment = require("moment/moment");
const { Services } = require("../../prisma/conn");
// const mysql = new PrismaClient();

//modul
const getall_LPLK = async (req = request, res = response) => {
	try {
		const { start, end } = await req.query;
		const starts = moment(start).toDate();
		const ends = moment(end).toDate();

		const getLaporan = await Services.findMany({
			where: {
				createdAt: {
					gte: starts,
					lte: ends,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",

			query: getLaporan,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const getLaporan_detail = async (req = request, res = response) => {
	try {
		const { unit, start, end } = await req.query;
		const starts = moment(start).toDate();
		const ends = moment(end).toDate();

		const laporanServis = await Services.findMany({
			where: {
				no_pol: unit,
				createdAt: {
					gte: starts,
					lte: ends,
				},
			},
			include: {
				detailpart: true,
				servisplus: true,
			},
		});

		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			query: laporanServis,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const getLaporanPart = async (req = request, res = response) => {
	try {
		const { unit, part, start, end } = await req.query;
		const starts = moment(start).toDate();
		const ends = moment(end).toDate();
		const getData = await Services.findMany({
			where: {
				AND: [
					{
						createdAt: {
							gte: starts,
							lte: ends,
						},
					},
					{
						no_pol: unit,
					},
					{
						detailpart: {
							every: {
								nama: part,
								
							},
						},
					},
				],
			},
			include: {
				detailpart: true,
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			query: getData,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const getall_cabang = async (req = request, res = response) => {
	try {
		const { start, end } = await req.query;
		const starts = moment(start).toDate();
		const ends = moment(end).toDate();
		const { cabang_id } = await req.body;

		const getLaporan = await Services.findMany({
			where: {
				AND: [
					{
						createdAt: {
							gte: starts,
							lte: ends,
						},
					},
					{
						cabang_id: Number(cabang_id),
					},
				],
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",

			query: getLaporan,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};
module.exports = {
	getall_LPLK,
	getLaporan_detail,
	getLaporanPart,
	getall_cabang,
};
