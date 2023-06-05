const { CabangSchema, UnitSchema } = require("./schema");

const validator = require("express-joi-validation").createValidator({});

//validator unit
const UnitValidator = validator.body(UnitSchema);

module.exports = { UnitValidator };
