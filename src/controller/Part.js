const { request, response } = require("express");
const { Part } = require("../../prisma/conn");

//create data part
const create_part = async (req = request, res = response) => {
	try {
		const { nama, unit, kategori_id, no_pol } = await req.body;
		const postPart = await Part.create({
			data: {
				nama: nama,
				unit: unit,
				kategori_id: Number(kategori_id),
				no_pol: Number(no_pol),
			},
		});
		res.status(201).json({
			succes: true,
			message: "Data berhasil dibuat",
			query: postPart,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

// get all part
const get_part = async (req = request, res = response) => {
	try {
		const { limit, page, id } = await req.query;
		//page
		const skip = (page - 1) * limit;
		const getPart = await Part.findMany({
			where: {
				kategori_id: Number(id) === 0 ? { in: [1, 2, 3] } : Number(id),
			},
		
			skip: parseInt(skip),
			take: parseInt(limit),
			orderBy:[
				{
					no_pol:"asc"

				},
				{
					nama:"asc"
				}
			],

			include: {
				kategori: {
					select: {
						nama: true,
					},
				},
				unit: {
					select: {
						no_pol: true,
						jenis_kendaraan: true,
					},
				},
			},
		});

		const countPage = await Part.count({
			where: {
				kategori_id: Number(id) === 0 ? { in: [1, 2, 3] } : Number(id),
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			current_page: parseInt(page),
			total_data: countPage,
			total_page: Math.ceil(countPage / limit),
			query: getPart,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

// get part byID
const detail_part = async (req = request, res = response) => {
	try {
		const { id } = await req.params;
		const getIdPart = await Part.findMany({
			where: {
				id: Number(id),
			},

			select: {
				id: true,
				nama: true,
				kategori: {
					select: {
						id: true,
						nama: true,
					},
				},
				unit: {
					select: {
						no_pol: true,
						jenis_kendaraan: true,
					},
				},
			},
		});
		res.status(200).json({
			succes: true,
			message: "Data berhasil ditampilkan",
			query: getIdPart,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

// update data part
const update_part = async (req = request, res = response) => {
	try {
		const { id } = await req.params;
		const { nama, unit, kategori_id, no_pol } = await req.body;
		const updatePart = await Part.update({
			where: {
				id: Number(id),
			},
			data: {
				nama: nama,
				unit: unit,
				kategori_id: Number(kategori_id),
				no_pol: Number(no_pol),
			},
		});
		res.status(201).json({
			succes: true,
			message: "Data berhasil diupdate",
			query: updatePart,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

//delete data part

const delete_part = async (req = request, res = response) => {
	try {
		const { id } = await req.params;
		const deletPart = await Part.delete({
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

module.exports = {
	create_part,
	get_part,
	detail_part,
	update_part,
	delete_part,
};
