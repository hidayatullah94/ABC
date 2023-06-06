const name = async (req = request, res = response) => {
  try {
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

const express = require("express");
const test = express.Router();
test.post("/");
test.get("/");
test.get("/:id");
test.put("/:id");
test.delete("/:id");
module.exports = test;
