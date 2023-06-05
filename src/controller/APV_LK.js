const { request, response } = require("express");
const { APV_LK, LK } = require("../../prisma/conn");

const create_apvLK = async (req = request, res = response) => {
	try {
		const { user_id, lk_id } = await req.body;

		const postApvLK = await APV_LK.create({
			data: {
				user_id: user_id,

				lk_id: Number(lk_id),
			},
		});
		const updatelk = await LK.update({
			where: {
				id: Number(lk_id),
			},
			data: {
				status: true,
			},
		});
		res.status(201).json({
			succes: true,
			message: "data berhasil ditambahkan",
			query: postApvLK,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const getAPV_LK = async (req = request, res = response) => {
	try {
		const getapvLK = await APV_LK.findMany({
			include: {
				users: {
					select: {
						id: true,
						nama: true,
						nik: true,
						hp: true,
						jabatan: true,
						role: true,
						url: true,
					},
				},
				lk: {
					include: {
						unit: true,
						users: true,
					},
				},
			},
		});
		res.status(200).json({
			succes: true,
			message: "data berhasil di tampilkan",
			query: getapvLK,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const getDetail_apvLK = async (req = request, res = response) => {
	try {
		const { id } = await req.params;
		const getDetailapvLK = await APV_LK.findMany({
			where: {
				id: Number(id),
			},
			include: {
				users: true,
				lk: {
					include: {
						unit: true,
						users: true,
					},
				},
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			query: getDetailapvLK,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};
module.exports = { create_apvLK, getAPV_LK, getDetail_apvLK };
