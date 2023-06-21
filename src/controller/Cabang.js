const { Cabang } = require("../../prisma/conn");
const { request, response } = require("express");

//create post cabang
const create_cabang = async (req = request, res = response) => {
  try {
    const { nama, telp, keterangan, alamat } = await req.body;
    const postCabang = await Cabang.create({
      data: {
        nama: nama,
        telp: telp,
        keterangan: keterangan,
        alamat: alamat,
      },
    });
    res.status(201).json({
      succes: true,
      message: "Data Berhasil ditambahkan",
      query: postCabang,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
// get list cabang
const getList_cabang = async (req = request, res = response) => {
  try {
    const getListcabang = await Cabang.findMany({
      where: {
        status: true,
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: getListcabang,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
//update post cabang
const update_cabang = async (req = request, res = response) => {
  try {
    const { id } = await req.params;
    const { nama, telp, keterangan, alamat, status } = await req.body;
    const putCabang = await Cabang.update({
      where: {
        id: Number(id),
      },
      data: {
        nama: nama,
        telp: telp,
        keterangan: keterangan,
        alamat: alamat,
        status: status === 1 ? true : false,
      },
    });
    res.status(201).json({
      succes: true,
      message: "Data Berhasil diupdate",
      query: putCabang,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//detail post cabang
const detail_cabang = async (req = request, res = response) => {
  try {
    const { id } = await req.params;
    const getIdCabang = await Cabang.findMany({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: getIdCabang,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

const get_cabang = async (req = request, res = response) => {
  try {
    const { limit, page } = await req.query;
    //page
    const skip = (page - 1) * limit;

    const getCabang = await Cabang.findMany({
      where: {
        status: true,
      },
      skip: parseInt(skip),
      take: parseInt(limit),
    });
    const countPage = await Cabang.count();
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      current_page: parseInt(page),
      total_data: countPage,
      total_page: Math.ceil(countPage / limit),
      query: getCabang,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

module.exports = {
  create_cabang,
  update_cabang,
  detail_cabang,
  get_cabang,
  getList_cabang,
};
