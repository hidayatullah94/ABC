const { request, response } = require("express");
const { Unit, Cabang } = require("../../prisma/conn");
const path = require("path");

//? get all post unit for ADMIN | MGR//create post unit
//create
const create_unit = async (req = request, res = response) => {
  try {
    const {
      no_pol,
      jenis_kendaraan,
      nama_pemilik,
      type_tahun,
      asuransi,
      no_mesin,
      no_rangka,
      no_lambung,
      cabang_id,
    } = await req.body;

    const url =
      req.protocol + "://" + req.get("host") + "/unit/" + req.file.filename;

    const findUnit = await Unit.findUnique({
      where: {
        no_pol: no_pol,
      },
    });

    if (findUnit) {
      return res.status(400).json({
        succes: false,
        message: "Unit sudah ada",
      });
    }

    const postUnit = await Unit.create({
      data: {
        no_pol: no_pol,
        jenis_kendaraan: jenis_kendaraan,
        nama_pemilik: nama_pemilik,
        type_tahun: type_tahun,
        no_lambung: no_lambung,
        no_rangka: no_rangka,
        no_mesin: no_mesin,
        asuransi: asuransi,

        url: url,
        cabang_id: Number(cabang_id),
      },
    });
    res.status(201).json({
      succes: true,
      message: "Data berhasil dibuat",
      query: postUnit,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.stack,
    });
  }
};

//update post unit
const update_unit = async (req = request, res = response) => {
  try {
    const { id } = await req.params;
    const {
      no_pol,
      jenis_kendaraan,
      nama_pemilik,
      type_tahun,
      asuransi,
      no_mesin,
      no_rangka,
      no_lambung,
      cabang_id,
    } = await req.body;

    const url =
      req.protocol + "://" + req.get("host") + "/unit/" + req.file.filename;

    const putUnit = await Unit.update({
      where: {
        id: Number(id),
      },
      data: {
        no_pol: no_pol,
        jenis_kendaraan: jenis_kendaraan,
        nama_pemilik: nama_pemilik,
        type_tahun: type_tahun,
        no_lambung: no_lambung,
        no_rangka: no_rangka,
        no_mesin: no_mesin,
        asuransi: asuransi,

        url: url,
        cabang_id: Number(cabang_id),
        status: true,
      },
    });
    res.status(201).json({
      succes: true,
      message: "Data berhasil diupdate",
      query: putUnit,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//detail post unit
const detail_unit = async (req = request, res = response) => {
  try {
    const { id } = await req.params;
    const getIdUnit = await Unit.findMany({
      where: {
        id: Number(id),
      },
      include: {
        cabang: {
          select: {
            nama: true,
            telp: true,
            alamat: true,
          },
        },
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: getIdUnit,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//get all
const get_unit = async (req = request, res = response) => {
  try {
    const { cabang, pemilik } = await req.query;

    //findcabang
    const cabangs = await Cabang.findMany();
    //find unit
    const unit = await Unit.findMany();
    const Pemilik = unit.map((e) => e.nama_pemilik);
    const resultPemilik = [...new Set(Pemilik)];

    const resultCabang = cabangs.map((e) => e.id);
    const getData = await Unit.findMany({
      where: {
        AND: [
          {
            cabang_id: cabang === "All" ? { in: resultCabang } : Number(cabang),
          },
          {
            nama_pemilik: pemilik === "All" ? { in: resultPemilik } : pemilik,
          },
        ],
      },

      include: {
        cabang: {
          select: {
            nama: true,
            telp: true,
            alamat: true,
          },
        },
      },
    });

    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: getData,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//get list all unit
const getListAll_unit = async (req = request, res = response) => {
  try {
    const getlistUnitall = await Unit.findMany({
      where: {
        aktif: true,
      },
      orderBy: {
        no_pol: "asc",
      },
      select: {
        no_pol: true,
        id: true,
        jenis_kendaraan: true,
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan ",
      query: getlistUnitall,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

const getUnit_part = async (req = request, res = response) => {
  try {
    const getpartUnit = await Unit.findMany({
      where: {
        aktif: true,
      },
      orderBy: {
        no_pol: "asc",
      },
      select: {
        no_pol: true,
        id: true,
        jenis_kendaraan: true,
      },
    });

    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan ",
      query: getpartUnit,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

const getDetail_part = async (req = request, res = response) => {
  try {
    const { no_pol } = await req.query;
    const findUnits = await Unit.findMany({
      where: {
        no_pol: no_pol,
      },

      select: {
        id: true,
        no_pol: true,
        part: {
          orderBy: {
            nama: "asc",
          },
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: findUnits,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
//!GET DATA USER BY CABANG
const get_unitUser = async (req = request, res = response) => {
  try {
    const { cabang_id } = await req.body;
    const { limit, page } = await req.query;
    const skip = (page - 1) * limit;
    const getDataByUser = await Unit.findMany({
      where: {
        cabang_id: parseInt(cabang_id),
      },
      orderBy: {
        jenis_kendaraan: "asc",
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        cabang: {
          select: {
            nama: true,
            telp: true,
            alamat: true,
          },
        },
      },
    });
    const countPage = await Unit.count({
      where: {
        cabang_id: parseInt(cabang_id),
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      current_page: parseInt(page),
      total_data: countPage,
      total_page: Math.ceil(countPage / limit),
      query: getDataByUser,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
// !get status list for user
const getLis_unit = async (req = request, res = response) => {
  try {
    const { cabang_id } = await req.body;
    const getlistUnit = await Unit.findMany({
      where: {
        AND: [
          {
            cabang_id: Number(cabang_id),
          },
          {
            aktif: true,
          },
        ],
      },
      select: {
        no_pol: true,
        id: true,
        jenis_kendaraan: true,
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: getlistUnit,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//?NEW ENDPOINT

const unit_Leasing = async (req = request, res = response) => {
  try {
    const unit = await Unit.findMany();
    const resultUnit = unit.map((e) => e.id);
    const getDataUnit = await Unit.findMany({
      where: {
        AND: [
          {
            unitleasing: {
              none: {
                unit_id: { in: resultUnit },
              },
            },
          },
          {
            aktif: true,
          },
        ],
      },
      orderBy: {
        no_pol: "asc",
      },
      select: {
        id: true,
        no_pol: true,
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data unit berhasil ditampilkan",
      query: getDataUnit,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
module.exports = {
  create_unit,
  update_unit,
  detail_unit,
  get_unit,
  getLis_unit,
  getListAll_unit,
  get_unitUser,
  getUnit_part,
  getDetail_part,
  unit_Leasing,
};
