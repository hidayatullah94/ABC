const moment = require("moment/moment");
const {
  Transaksi,
  Tahapan_Leasing,
  Unit_Leasing,
  Pembayaran_Leasing,
  Leasing,
} = require("../../prisma/conn");

//CREATE ANGSURAN / BULAN
// const create_Angsuran = async (req = request, res = response) => {
//   try {
//     const { approve2, cicilan_id, user_id } = await req.body;

//     //check angsuran
//     const findAngsuran = await Cicilan.findUnique({
//       where: {
//         id: Number(cicilan_id),
//       },
//       select: {
//         jatuh_tempo: true,
//         sisa_angsuran: true,
//         tenggat_waktu: true,
//         angsuranke: true,
//       },
//     });

//     //CONVERT TEMPO AUTO 1 BULAN
//     const tempo = moment(findAngsuran.jatuh_tempo).toDate();
//     tempo.setMonth(tempo.getMonth() + 1);
//     const tenggat = moment(findAngsuran.tenggat_waktu).toDate();
//     tenggat.setMonth(tenggat.getMonth() + 1);

//     //count data perbulan
//     const countPerbulan = await Detail_unit.aggregate({
//       where: {
//         cicilan_id: Number(cicilan_id),
//       },
//       _sum: {
//         angsuran_perbulan: true,
//       },
//     });

//     if (findAngsuran.sisa_angsuran === 1) {
//       const updateCicilan = await Cicilan.update({
//         where: {
//           id: Number(cicilan_id),
//         },
//         data: {
//           status: true,
//         },
//       });
//     }

//     if (findAngsuran.sisa_angsuran === 0) {
//       return res.status(400).json({
//         succes: false,
//         message: "angsuran melebihi tenor",
//       });
//     }
//     const TransaksiAngsuran = await Transaksi.$transaction([
//       //create data
//       Angsuran.create({
//         data: {
//           total_angsuran: countPerbulan._sum.angsuran_perbulan,
//           approve2: approve2,
//           create_id: Number(user_id),
//           cicilan_id: Number(cicilan_id),
//           jatuh_tempo: findAngsuran.jatuh_tempo,
//           angsuranke: findAngsuran.angsuranke + 1,
//           sisa_angsuran: findAngsuran.sisa_angsuran - 1,
//           status: false,
//         },
//       }),

//       //check update angsuran perbulan
//       Cicilan.update({
//         where: {
//           id: Number(cicilan_id),
//         },
//         data: {
//           sisa_angsuran: {
//             decrement: 1,
//           },
//           angsuranke: {
//             increment: 1,
//           },
//           jatuh_tempo: tempo,
//           tenggat_waktu: tenggat,
//         },
//       }),
//     ]);
//     //BLOK ANGSURAN LEBIH DARI TOTAL ANGSURAN

//     res.status(201).json({
//       succes: true,
//       message: "Data berhasil dibuat",
//       query: TransaksiAngsuran,
//     });
//   } catch (error) {
//     res.status(500).json({
//       succes: false,
//       error: error.message,
//     });
//   }
// };

//? Create tahapan Pembayaran
const create_Tahapan = async (req = request, res = response) => {
  try {
    const { nama } = await req.body;
    const createData = await Tahapan_Leasing.create({
      data: {
        nama: nama,
      },
    });
    res.status(201).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: createData,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//? create cicilan
const create_NewCicilan = async (req = request, res = response) => {
  try {
    const {
      kontrak,
      tenor,
      angsuran_perbulan,
      va,
      tempo,
      harga_beli,
      dp_unit,
      unit_id,
      leasing_id,
      tahapan_id,
      user_name,
    } = await req.body;

    const jatuh_tempo = moment(tempo).toDate();

    const createData = await Unit_Leasing.create({
      data: {
        kontrak: kontrak,
        tenor: Number(tenor),
        angsuran_perbulan: Number(angsuran_perbulan),
        angsuranke: 2,
        sisa_angsuran: Number(tenor) - 2,
        va: Number(va),
        tempo: jatuh_tempo,
        harga_beli: Number(harga_beli),
        dp_unit: Number(dp_unit),
        unit_id: Number(unit_id),
        leasing_id: Number(leasing_id),
        tahapan_id: Number(tahapan_id),
        tahap_tempo: jatuh_tempo,
        created: user_name,
      },
    });
    res.status(201).json({
      succes: true,
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

//?create pembayaran
const create_Pembayaran = async (req = request, res = response) => {
  try {
    const { tahapan_id, leasing_id, total, app2, detailleasing, user_id } =
      await req.body;

    // //for tempo
    const findUnit = await Unit_Leasing.findMany({
      where: {
        AND: [
          {
            tahapan_id: Number(tahapan_id),
          },
          {
            leasing_id: Number(leasing_id),
          },
          {
            status: false,
          },
        ],
      },
      select: {
        tempo: true,
      },
    });

    // const resultTempo = findUnit.map((e) => e.tempo);
    // // Create an empty array to store the incremented dates
    // const incTempo = [];
    // resultTempo.forEach((dateString) => {
    //   const originalDate = moment(dateString, "YYYY-MM-DD");
    //   const incrementedDate = originalDate.add(1, "months");
    //   incTempo.push(incrementedDate.toDate());
    // });

    const tahapTempo = moment(new Date()).add(1, "months");
    const tempo = moment(tahapTempo).toDate();

    //transaksi
    const Transaksi_pembayaran = await Transaksi.$transaction([
      //create Data unit leasing

      Pembayaran_Leasing.create({
        data: {
          tahapan_id: Number(tahapan_id),
          leasing_id: Number(leasing_id),
          total: Number(total),
          app2: app2,
          user_id: user_id,
          detailleasing: {
            create: detailleasing,
          },
        },
      }),

      //update unit leasing
      Unit_Leasing.updateMany({
        where: {
          AND: [
            {
              tahapan_id: Number(tahapan_id),
            },
            {
              leasing_id: Number(leasing_id),
            },
            {
              status: false,
            },
          ],
        },
        data: {
          angsuranke: {
            increment: 1,
          },
          sisa_angsuran: {
            decrement: 1,
          },
          tahap_tempo: tempo,
        },
      }),

      //update sisa angsuran
      Unit_Leasing.updateMany({
        where: {
          AND: [
            {
              status: false,
            },
            {
              tahapan_id: Number(tahapan_id),
            },
            {
              leasing_id: Number(leasing_id),
            },
            {
              sisa_angsuran: 0,
            },
          ],
        },
        data: {
          status: true,
        },
      }),
    ]);
    res.status(201).json({
      succes: true,
      message: "Data berhasil di buat",
      query: Transaksi_pembayaran,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//? get data untuk pembayaran
const getAll_UnitLeasing = async (req = request, res = response) => {
  try {
    const { tahap, leasing } = await req.query;
    const getAllUnit = await Unit_Leasing.findMany({
      where: {
        AND: [
          {
            status: false,
          },
          {
            tahapan_id: Number(tahap),
          },
          {
            leasing_id: Number(leasing),
          },
        ],
      },

      include: {
        leasing: true,
        unit: {
          select: {
            id: true,
            no_pol: true,
            jenis_kendaraan: true,
            cabang: true,
          },
        },
      },
    });
    //count total
    const countData = await Unit_Leasing.aggregate({
      where: {
        AND: [
          {
            status: false,
          },
          {
            tahapan_id: Number(tahap),
          },
          {
            leasing_id: Number(leasing),
          },
        ],
      },
      _sum: {
        angsuran_perbulan: true,
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: getAllUnit,
      countData: countData._sum,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
//get data all cicilan
const getAll_Cicilan = async (req = request, res = response) => {
  try {
    const { status, tahap, leasing } = await req.query;
    const leasings = await Leasing.findMany();
    const resulLeasing = leasings.map((e) => e.id);
    const getAllData = await Unit_Leasing.findMany({
      where: {
        AND: [
          {
            status: status === "false" ? false : true,
          },
          {
            tahapan_id: tahap === "All" ? { in: [1, 2, 3] } : Number(tahap),
          },
          {
            leasing_id:
              leasing === "All" ? { in: resulLeasing } : Number(leasing),
          },
        ],
      },
      include: {
        tahapan: true,
        leasing: true,
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: getAllData,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//detail unit leasing
const detail_UnitLeasing = async (req = request, res = response) => {
  try {
    const { id } = await req.params;
    const getDetail = await Unit_Leasing.findMany({
      where: {
        id: Number(id),
      },
      include: {
        leasing: true,
        unit: {
          select: {
            id: true,
            no_pol: true,
            jenis_kendaraan: true,
          },
        },
        detailLeasing: true,
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: getDetail,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//get all data pembayaran
const getAll_Pembayaran = async (req = request, res = response) => {
  try {
    const { limit, page } = await req.query;
    //page
    const skip = (page - 1) * limit;
    const getData = await Pembayaran_Leasing.findMany({
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        leasing: true,
        tahapan: true,
        users: {
          select: {
            id: true,
            nama: true,
            url: true,
          },
        },
      },
    });
    const countPage = await Pembayaran_Leasing.count();
    res.status(200).json({
      succes: true,
      message: "Data berhasil di tampilkan",
      current_page: parseInt(page),
      total_data: countPage,
      total_page: Math.ceil(countPage / limit),
      query: getData,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//detail pembayaran
const detail_pembayaran = async (req = request, res = response) => {
  try {
    const { id } = await req.params;
    const getData = await Pembayaran_Leasing.findMany({
      where: {
        id: Number(id),
      },
      include: {
        tahapan: true,
        leasing: true,
        detailleasing: true,
        users: {
          select: {
            id: true,
            nama: true,
            url: true,
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

//approve pembayaran
const app_pembayaran = async (req = request, res = response) => {
  try {
    const { user_name, ttd } = await req.body;
    const { id } = await req.params;

    const updateData = await Pembayaran_Leasing.update({
      where: {
        id: Number(id),
      },
      data: {
        status: true,
      },
    });
    res.status(201).json({
      succes: true,
      message: "Data berhasil diupdate",
      query: updateData,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//notifikasi
const notif_UnitLeasing = async (req = request, res = response) => {
  try {
    const { start, end } = await req.query;
    const starts = moment(start).toDate();
    const ends = moment(end).toDate();

    const notif = await Unit_Leasing.count({
      where: {
        tahap_tempo: {
          gte: starts,
          lte: ends,
        },
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: notif,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
//get unit jatuh tempo
const getTempo_Unitleasing = async (req = request, res = response) => {
  try {
    const { start, end } = await req.query;
    const starts = moment(start).toDate();
    const ends = moment(end).toDate();

    const getData = await Unit_Leasing.findMany({
      where: {
        tahap_tempo: {
          gte: starts,
          lte: ends,
        },
      },
      include: {
        leasing: true,
        tahapan: true,
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
module.exports = {
  create_Tahapan,
  create_NewCicilan,
  create_Pembayaran,
  getAll_UnitLeasing,
  getAll_Cicilan,
  detail_UnitLeasing,
  getAll_Pembayaran,
  detail_pembayaran,
  app_pembayaran,
  notif_UnitLeasing,
  getTempo_Unitleasing,
};
