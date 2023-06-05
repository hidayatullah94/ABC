const { request, response } = require("express");
const { APV_SPK, SPK } = require("../../prisma/conn");

const createapv_SPK = async (req = request, res = response) => {
	try {
		const { spk_id, user_id } = await req.body;
		const apvSPK = await APV_SPK.create({
			data: {
				spk_id: Number(spk_id),
				user_id: user_id,
			},
		});
		const updateSPK = await SPK.update({
			where: {
				id: Number(spk_id),
			},
			data: {
				status: true,
			},
		});
		res.status(201).json({
			succes: true,
			message: "Data berhasil ditambahkan",
			query: apvSPK,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.stack,
		});
	}
};
const getDetail_apvSPK = async (req = request, res = response) => {
	try {
		const { id } = await req.params;
		const getDetail = await APV_SPK.findMany({
			where: {
				id: Number(id),
			},
			include: {
				spk: {
					include: {
						apvlk: {
							include: {
								lk: {
									include: {
										unit: {
											include: {
												part: {
													select: {
														nama: true,
														kategori: true,
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			query: getDetail,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};
const getAll_apvSPK = async (req = request, res = response) => {
	try {
		const getAPVSPK = await APV_SPK.findMany();
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan ",
			query: getAPVSPK,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};
module.exports = { createapv_SPK, getAll_apvSPK, getDetail_apvSPK };
