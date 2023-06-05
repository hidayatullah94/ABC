const { request, response } = require("express");
const { SPK, APV_LK, LK } = require("../../prisma/conn");

const create_SPK = async (req = request, res = response) => {
  try {
    const {
      user,
      alamat,
      alamat_bengkel,
      detailservis,
      catatan,
      user_id,
      bengkel_id,
      apvlk_id,
      prihal,
      no_lk,
    } = await req.body;
    const postSPK = await SPK.create({
      data: {
        user: user,
        alamat: alamat,
        alamat_bengkel: alamat_bengkel,
        catatan: catatan,
        user_id: user_id,
        bengkel_id: Number(bengkel_id),
        apvlk_id: Number(apvlk_id),
        prihal: prihal,
        no_lk: no_lk,
        detailservis: {
          create: detailservis,
        },
      },
    });

    const updateApv_lk = await APV_LK.update({
      where: {
        id: Number(apvlk_id),
      },
      data: {
        status: true,
      },
    });

    //search lk id
    const findLk = await APV_LK.findUnique({
      where: {
        id: Number(apvlk_id),
      },
    });

    const updateLk = await LK.update({
      where: {
        id: Number(findLk.lk_id),
      },
      data: {
        status_spk: true,
      },
    });

    res.status(201).json({
      succes: true,
      message: "Data berhasil dibuat",
      query: postSPK,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

const getall_SPK = async (req = request, res = response) => {
  try {
    const { limit, page } = await req.query;
    //page
    const skip = (page - 1) * limit;

    const getSPK = await SPK.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        bengkel: {
          select: {
            id: true,
            nama: true,
            alamat: true,
            telp: true,
          },
        },

        apv_lk: {
          include: {
            lk: {
              select: {
                unit: {
                  select: {
                    no_pol: true,
                    jenis_kendaraan: true,
                  },
                },
              },
            },
          },
        },
        apv_spk: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });
    const countPage = await SPK.count();
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      current_page: parseInt(page),
      total_data: countPage,
      total_page: Math.ceil(countPage / limit),
      query: getSPK,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
const getByUser = async (req = request, res = response) => {
  try {
    const { limit, page } = await req.query;
    const { Role, cabang_id } = await req.body;
    const skip = (page - 1) * limit;

    if (Role !== "USER") {
      return res
        .status(403)
        .json({ msg: "Maaf anda tidak bisa mengakses halaman ini" });
    }
    if (Role === "USER") {
      const getDatabyUser = await SPK.findMany({
        where: {
          apv_lk: {
            lk: {
              unit: {
                cabang_id: Number(cabang_id),
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          bengkel: {
            select: {
              id: true,
              nama: true,
              alamat: true,
              telp: true,
            },
          },
          apv_lk: {
            include: {
              lk: {
                select: {
                  unit: {
                    select: {
                      no_pol: true,
                      jenis_kendaraan: true,
                    },
                  },
                },
              },
            },
          },
          apv_spk: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });
      const countPage = await SPK.count({
        where: {
          apv_lk: {
            lk: {
              unit: {
                cabang_id: Number(cabang_id),
              },
            },
          },
        },
      });
      res.status(200).json({
        succes: true,
        message: "Data berhasil ditampilkan",
        current_page: parseInt(page),
        total_data: countPage,
        total_page: Math.ceil(countPage / limit),
        query: getDatabyUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
const getDetail_SPK = async (req = request, res = response) => {
  try {
    const { id } = await req.params;
    const getDetailSPK = await SPK.findMany({
      where: {
        id: Number(id),
      },

      select: {
        id: true,
        user: true,
        alamat: true,
        createdAt: true,
        catatan: true,
        status: true,
        alamat_bengkel: true,
        prihal: true,
        detailservis: true,
        no_lk: true,
        bengkel: {
          select: {
            nama: true,
            alamat: true,
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
            lk: {
              select: {
                id: true,
                kilometer: true,

                unit: {
                  select: {
                    id: true,
                    jenis_kendaraan: true,
                    nama_pemilik: true,
                    no_pol: true,
                    type_tahun: true,
                    part: {
                      orderBy: {
                        nama: "asc",
                      },
                      select: {
                        id: true,
                        nama: true,
                        kategori_id: true,
                      },
                    },
                    cabang: {
                      select: {
                        nama: true,
                        keterangan: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        apv_spk: {
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
      message: "Data berhasil ditampilkan",
      query: getDetailSPK,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
module.exports = { create_SPK, getall_SPK, getDetail_SPK, getByUser };
