const { request, response } = require("express");
const {
  Unit,
  APV_SPK,
  SPK,
  APV_LK,
  LK,
  Services,
} = require("../../prisma/conn");
const path = require("path");

//logic
const create_service = async (req = request, res = response) => {
  try {
    const {
      user_id,
      cabang_id,
      apvspk_id,
      no_pol,
      jenis_kendaraan,
      kilometer,
      type_tahun,
      bengkel,
      total,
      detail_service,
      total_service,
      no_spk,
    } = await req.body;
    const img = req.file.path;
    const url =
      req.protocol + "://" + req.get("host") + "/servis/" + req.file.filename;

    // post data
    const createService = await Services.create({
      data: {
        user_id: user_id,
        cabang_id: cabang_id,
        apvspk_id: Number(apvspk_id),
        no_pol: no_pol,
        jenis_kendaraan: jenis_kendaraan,
        kilometer: kilometer,
        type_tahun: type_tahun,
        bengkel: bengkel,
        total: parseInt(total),
        img: img,
        url: url,
        no_spk: no_spk,
        detailpart: {
          create: JSON.parse(detail_service),
        },
        servisplus: {
          create: JSON.parse(total_service),
        },
      },
      include: {
        detailpart: true,
        servisplus: true,
      },
    });

    // UPDATEC APV_ SPK
    const update_apvspk = await APV_SPK.update({
      where: {
        id: Number(apvspk_id),
      },
      data: {
        status: true,
      },
    });

    //SEARCH ID SPK
    const searchSPK = await SPK.findUnique({
      where: {
        id: Number(update_apvspk.spk_id),
      },
    });

    // SEARCH ID APV_LK
    const searchAPV_LK = await APV_LK.findUnique({
      where: {
        id: Number(searchSPK.apvlk_id),
      },
    });

    //SEARCH LK ID
    const searchLK = await LK.findUnique({
      where: {
        id: Number(searchAPV_LK.lk_id),
      },
    });

    // UPDATE UNIT
    const update_unit = await Unit.update({
      where: {
        id: Number(searchLK.no_pol),
      },
      data: {
        status: true,
      },
    });
    res.status(201).json({
      succes: true,
      message: "Data berhasil ditambahkan",
      query: createService,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

// get all data
const get_alldata = async (req = request, res = response) => {
  try {
    const { limit, page } = await req.query;
    const skip = (page - 1) * limit;
    const getData = await Services.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        no_pol: true,
        jenis_kendaraan: true,
        kilometer: true,
        type_tahun: true,
        bengkel: true,
        total: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            nama: true,
            nik: true,
            cabang: {
              select: {
                nama: true,
              },
            },
          },
        },
        detailpart: true,
        servisplus: true,
      },
    });
    const countService = await Services.count();
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      current_page: parseInt(page),
      total_data: countService,
      total_page: Math.ceil(countService / limit),
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
const getDetail_service = async (req = request, res = response) => {
  try {
    const { id } = await req.params;
    const getDetail = await Services.findMany({
      where: {
        id: Number(id),
      },

      select: {
        no_pol: true,
        jenis_kendaraan: true,
        kilometer: true,
        type_tahun: true,
        bengkel: true,
        total: true,
        createdAt: true,
        url: true,
        no_spk: true,
        users: {
          select: {
            id: true,
            nama: true,
            nik: true,
            cabang: {
              select: {
                nama: true,
              },
            },
          },
        },
        apv_spk: {
          select: {
            users: {
              select: {
                id: true,
                nama: true,
                url: true,
              },
            },
            spk: {
              include: {
                detailservis: true,
                bengkel: true,
                users: {
                  select: {
                    id: true,
                    nama: true,
                    jabatan: true,
                    url: true,
                  },
                },
                apv_lk: {
                  include: {
                    users: {
                      select: {
                        id: true,
                        nama: true,
                        url: true,
                        jabatan: true,
                      },
                    },
                    lk: {
                      include: {
                        detailkerusakan: true,
                        unit: true,
                        bukti_lk: true,
                        users: {
                          select: {
                            id: true,
                            nama: true,
                            url: true,
                            jabatan: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        detailpart: true,
        servisplus: true,
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

const getBycabang = async (req = request, res = response) => {
  try {
    const { limit, page } = await req.query;
    const { cabang_id } = await req.body;
    const skip = (page - 1) * limit;

    const getData = await Services.findMany({
      where: {
        users: {
          cabang_id: Number(cabang_id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        no_pol: true,
        jenis_kendaraan: true,
        kilometer: true,
        type_tahun: true,
        bengkel: true,
        total: true,
        createdAt: true,
        apvspk_id: true,
        no_spk: true,
        users: {
          select: {
            id: true,
            nama: true,
            nik: true,
            cabang: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
    });
    const countPage = await Services.count({
      where: {
        users: {
          cabang_id: Number(cabang_id),
        },
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
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
module.exports = {
  create_service,
  get_alldata,
  getDetail_service,
  getBycabang,
};
