const Joi = require("joi");

//for unit
const UnitSchema = Joi.object({
	no_pol: Joi.string().required(),
	jenis_kendaraan: Joi.string().required(),
	nama_pemilik: Joi.string(),
	type_tahun: Joi.string(),
	no_lambung: Joi.string(),
	no_rangka: Joi.string(),
	no_mesin: Joi.string(),
	asuransi: Joi.string(),
	gambar: Joi.string(),
	cabang_id: Joi.number().required(),
	status: Joi.boolean(),
});

module.exports = { UnitSchema };
