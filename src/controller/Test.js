const { Test, Testing } = require("../../prisma/conn");
const { request, response } = require("express");
const path = require("path");
const { prisma } = require("@prisma/client");

const test = async (req = request, res = response) => {
	try {
		const { nama } = req.body;
		//handle file upload
		const file = await req.files.img;
		const fileSize = file.data.length;
		const ext = path.extname(file.name);
		const fileName = file.md5 + ext;
		const url = `${req.protocol}://${req.get("host")}/testing/${fileName}`;
		const allowType = [".png", ".jpg", ".jpeg"];
		if (!allowType.includes(ext.toLowerCase()))
			return res.status(422).json({
				message: "Harus bertype JPG,JPEG,PNG",
			});
		if (fileSize > 5000000)
			return res.status(422).json({
				message: "File terlalu besar, max 5 MB",
			});
		file.mv(`./public/testing/${fileName}`, async (err) => {
			if (err) return res.status(500).json({ message: err.message });
		});

		const testpost = await Test.create({
			data: {
				nama: nama,
				img: fileName,
				url: url,
			},
		});
		res.status(201).json({
			status: "succes",
			query: testpost,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const search = async (req = request, res = response) => {
	try {
		const { content } = await req.query;
		const reseacrh = await Test.findMany({
			where: {
				nama: {
					search: "dina",
				},
			},
		});
		res.status(200).json({
			status: "succes",
			query: search,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const create_test = async (req = request, res = response) => {
	try {
		const { nama } = await req.body;
		const testings = await Test.create({
			data: {
				nama,
				testing: {
					create: {
						status: true,
					},
				},
			},
		});
		res.status(201).json({
			succes: true,
			message: "berhasil",
			query: testings,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const coba = async (req = request, res = response) => {
	try {
		const { nama } = await req.body;
		const cobalh = await Testing.create({
			data: {
				nama: nama,
				test: {
					create: {
						nama: "lova",
						status: false,
					},
				},
			},
		});
		res.status(201).json({
			succes: true,
			message: "berhasil",
			query: cobalh,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};

const get_coba = async (req = request, res = response) => {
	try {
		const getcoba = await Testing.findMany({
			include: {
				test: true,
			},
		});
		res.status(200).json({
			succes: true,
			query: getcoba,
		});
	} catch (error) {
		res.status(500).json({
			succes: false,
			error: error.message,
		});
	}
};
module.exports = { test, search, create_test, coba, get_coba };
