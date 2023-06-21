const { request, response } = require("express");
const { Leasing } = require("../../prisma/conn");

//create
const create_Leasing = async (req = request, res = response) => {
  try {
    const { nama, alamat, telp, nama_bank, no_rekening, user_name } =
      await req.body;

    const createData = await Leasing.create({
      data: {
        nama: nama,
        alamat: alamat,
        telp: telp,
        nama_bank: nama_bank,
        no_rekening: Number(no_rekening),
        created: user_name,
      },
    });
    res.status(201).json({
      status: true,
      message: "Data berhasil ditambahkan",
      query: createData,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
//get query (bank)
const getAll_Leasing = async (req = request, res = response) => {
  try {
    const banks = await Leasing.findMany();
    const Bank = banks.map((e) => e.nama_bank);
    let resultBank = [...new Set(Bank)];
    const { bank } = await req.query;
    const getData = await Leasing.findMany({
      where: {
        AND: [
          { nama_bank: bank === "All" ? { in: resultBank } : bank },
          {
            status: true,
          },
        ],
      },
      orderBy: {
        nama: "asc",
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditambahkan",
      query: getData,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
//get detail
const getByID_Leasing = async (req = request, res = response) => {
  try {
    const { id } = await req.params;

    const getById = await Leasing.findMany({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: getById,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
//update data
const update_Leasing = async (req = request, res = response) => {
  try {
    const { id } = await req.params;
    const { nama, alamat, telp, nama_bank, no_rekening, user_name } =
      await req.body;

    const updateLeasing = await Leasing.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nama: nama,
        alamat: alamat,
        telp: telp,
        nama_bank: nama_bank,
        no_rekening: Number(no_rekening),
        status: true,
        created: user_name,
      },
    });
    res.status(201).json({
      succes: true,
      message: "Data berhasil diupdate",
      query: updateLeasing,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//list Leasing
const list_Leasing = async (req = request, res = response) => {
  try {
    const getList = await Leasing.findMany({
      where: {
        status: true,
      },
      select: {
        id: true,
        nama: true,
        nama_bank: true,
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data Berhasil ditampilkan",
      query: getList,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

module.exports = {
  create_Leasing,
  getAll_Leasing,
  getByID_Leasing,
  update_Leasing,
  list_Leasing,
 
};
