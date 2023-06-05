const { PrismaClient } = require("@prisma/client");

const conn = new PrismaClient();

const Cabang = conn.cabang;
const Bengkel = conn.bengkel;
const Unit = conn.unit;
const Kategori = conn.kategori;
const Users = conn.users;
const Part = conn.part;
const LK = conn.lk;
const APV_LK = conn.apv_lk;
const SPK = conn.spk;
const APV_SPK = conn.apv_spk;
const Services = conn.servis;
const DetailPart = conn.detailpart;
const ServisPlus = conn.servisplus;
//? new
const Leasing = conn.leasing;
const Transaksi = conn;
const Tahapan_Leasing = conn.jenis_tahapan;
const Pembayaran_Leasing = conn.pembayaran_leasing;
const Unit_Leasing = conn.unit_leasing;

//modul
module.exports = {
  Cabang,
  Bengkel,
  Unit,
  Kategori,
  Users,
  Part,
  LK,
  SPK,
  APV_LK,
  APV_SPK,
  Services,
  DetailPart,
  ServisPlus,

  //? new
  Leasing,
  Transaksi,
  Tahapan_Leasing,
  Pembayaran_Leasing,
  Unit_Leasing,
};
