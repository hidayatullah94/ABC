const express = require("express");
const name = express.Router();
name.post("/");
name.get("/");
name.get("/:id");
name.put("/:id");
name.delete("/:id");
module.exports = name;
