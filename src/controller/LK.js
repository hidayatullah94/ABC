const { request, response } = require("express");
const { LK, Unit } = require("../../prisma/conn");

const create_LK = async (req = request, res = response) => {
  try {
    const { kilometer, user_id, no_pol, detailkerusakan } = await req.body;

    const fileUrls = req.files.map(
      (file) => req.protocol + "://" + req.get("host") + "/lk/" + file.filename
    );

    const postLK = await LK.create({
      data: {
        kilometer: Number(kilometer),
        no_pol: Number(no_pol),
        user_id: user_id,
        detailkerusakan: {
          create: JSON.parse(detailkerusakan),
        },
        bukti_lk: {
          create: fileUrls.map((url) => ({ url })),
        },
      },
      include: {
        detailkerusakan: true,
        bukti_lk: true,
      },
    });

    const updateUnit = await Unit.update({
      where: {
        id: Number(no_pol),
      },
      data: {
        status: false,
      },
    });
    res.status(201).json({
      succes: true,
      message: "Data berhasil ditambahkan",
      query: postLK,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//?FOR ADMIN
const get_LK = async (req = request, res = response) => {
  try {
    const { limit, page } = await req.query;
    //page
    const skip = (page - 1) * limit;

    const getLK = await LK.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        unit: {
          select: {
            id: true,
            no_pol: true,
            jenis_kendaraan: true,
            nama_pemilik: true,
            status: true,
            cabang: true,
            url: true,
          },
        },
        users: {
          select: {
            id: true,
            nama: true,
            nik: true,
            hp: true,
            jabatan: true,
            url: true,
          },
        },
        apv_lk: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
    const countPage = await LK.count();
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      current_page: parseInt(page),
      total_data: countPage,
      total_page: Math.ceil(countPage / limit),
      query: getLK,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.stack,
    });
  }
};

const get_LKbyCabang = async (req = request, res = response) => {
  try {
    const { limit, page } = await req.query;
    const { cabang_id } = await req.body;
    //page

    const skip = (page - 1) * limit;
    const getByCabang = await LK.findMany({
      where: {
        unit: {
          cabang_id: Number(cabang_id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: parseInt(skip),
      take: parseInt(limit),

      include: {
        unit: {
          select: {
            id: true,
            no_pol: true,
            jenis_kendaraan: true,
            nama_pemilik: true,
            status: true,
            cabang: true,
            url: true,
          },
        },
        users: {
          select: {
            id: true,
            nama: true,
            nik: true,
            hp: true,
            jabatan: true,
            url: true,
          },
        },
      },
    });
    const countPage = await LK.count({
      where: {
        unit: {
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
      query: getByCabang,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
const getDetail_LK = async (req = request, res = response) => {
  try {
    const { id } = await req.params;
    const getDetailLK = await LK.findMany({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        kilometer: true,
        status: true,
        detailkerusakan: true,
        bukti_lk: true,
        createdAt: true,
        unit: {
          select: {
            id: true,
            no_lambung: true,
            no_mesin: true,
            no_pol: true,
            no_rangka: true,
            jenis_kendaraan: true,
            nama_pemilik: true,
            asuransi: true,
            url: true,
            cabang: {
              select: {
                id: true,
                nama: true,
                keterangan: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            nama: true,
            nik: true,
            jabatan: true,
            url: true,
          },
        },
        apv_lk: {
          select: {
            id: true,
            users: {
              select: {
                id: true,
                nama: true,
                nik: true,
                jabatan: true,
                url: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      succes: true,
      message: "data berhasil ditampilkan",
      query: getDetailLK,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

const update_LK = async (req = request, res = response) => {
  try {
    const { kilometer, kerusakan, sebab_kerusakan, user_id, no_pol } =
      await req.body;
    const { id } = await req.params;
    const updateLK = await LK.update({
      where: {
        id: Number(id),
      },
      data: {
        kilometer: Number(kilometer),
        kerusakan: kerusakan,
        sebab_kerusakan: sebab_kerusakan,
        no_pol: Number(no_pol),
        user_id: user_id,
      },
    });
    res.status(200).json({
      succes: true,
      message: "data berhasil di update",
      query: updateLK,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

module.exports = {
  create_LK,
  get_LK,
  getDetail_LK,
  update_LK,
  get_LKbyCabang,
};
