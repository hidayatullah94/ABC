const {request, response} = require("express");
const {Services, SPK, LK} = require("../../prisma/conn");
const moment = require("moment");

//piecahrt
const PieChart = async (req = request, res = response) => {
	try {
		const {date} = await req.query;
		const starts = moment(date).toDate();

		//SERVICE
		const Getservis = await Services.count({
			where: {
				createdAt: {
					gte: starts,
				},
			},
		});

		// //SPK
		const getSPK = await SPK.count({
			where: {
				createdAt: {
					gte: starts,
				},
			},
		});
		// //LK
		const getLK = await LK.count({
			where: {
				createdAt: {
					gte: starts,
				},
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			lks: getLK,
			spks: getSPK,
			servis: Getservis,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const PieChart_cabang = async (req = request, res = response) => {
	try {
		const {date} = await req.query;
		const {cabang_id} = await req.body;
		const starts = moment(date).toDate();

		//SERVICE
		const Getservis = await Services.count({
			where: {
				AND: [
					{
						cabang_id: Number(cabang_id),
					},
					{
						createdAt: {
							gte: starts,
						},
					},
				],
			},
		});

		// //SPK
		const getSPK = await SPK.count({
			where: {
				AND: [
					{
						apv_lk: {
							lk: {
								users: {
									cabang_id: Number(cabang_id),
								},
							},
						},
					},
					{
						createdAt: {
							gte: starts,
						},
					},
				],
			},
		});
		// //LK
		const getLK = await LK.count({
			where: {
				AND: [
					{
						users: {
							cabang_id: Number(cabang_id),
						},
					},
					{
						createdAt: {
							gte: starts,
						},
					},
				],
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			lks: getLK,
			spks: getSPK,
			servis: Getservis,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

//get by cabang
const Cabang = async (req = request, res = response) => {
	try {
		const {start, end} = await req.query;
		const starts = moment(start).toDate();
		const ends = moment(end).toDate();

		const getService = await Services.groupBy({
			by: ["cabang_id"],
			where: {
				createdAt: {
					gte: starts,
					lte: ends,
				},
			},
			_avg: {
				total: true,
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			query: getService,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

module.exports = {PieChart, Cabang, PieChart_cabang};
