const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/servis");
	},
	filename: function (req, file, cb) {
		cb(
			null,
			path.parse(file.originalname).name +
				"-" +
				Date.now() +
				path.extname(file.originalname)
		);
	},
});

const uploadServis = multer({
	storage: storage,
	limits: 5 * 1000 * 1000,
});

module.exports = uploadServis;
