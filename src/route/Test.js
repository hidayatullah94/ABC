const express = require("express");
const {
	test,
	search,
	create_test,
	coba,
	get_coba,
} = require("../controller/Test");
// const upload = require("../middleware/uploadMiddleware");

const Test = express.Router();
Test.post("/testing", test);
Test.get("/search", search);
Test.post("/creates", create_test);
Test.post("/coba", coba);
Test.get("/getcoba", get_coba);

module.exports = Test;
