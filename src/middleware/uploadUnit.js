const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/unit");
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

const uploadUnit = multer({
	storage: storage,
	limits: 5 * 1000 * 1000,
});

module.exports = uploadUnit;
