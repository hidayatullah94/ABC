const { request, response } = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { Users, Cabang } = require("../../prisma/conn");
const { users_role } = require("@prisma/client");

//create user / REGISTER
const create_user = async (req = request, res = response) => {
  try {
    const { nama, nik, hp, jabatan, password, cabang_id, role } =
      await req.body;

    const url =
      req.protocol + "://" + req.get("host") + "/user/" + req.file.filename;

    // hashed

    const hash = await argon2.hash(password);
    //check user dr database
    const checkUsername = await Users.findUnique({
      where: {
        nik: nik,
      },
    });
    if (checkUsername) {
      return res.status(400).json({
        succes: false,
        message: "User has already axist ",
      });
    }

    const postUser = await Users.create({
      data: {
        nama: nama,
        nik: nik,
        hp: hp,
        jabatan:
          role === "ADMIN" || role === "DIREKSI" || role === "MANAGER"
            ? role
            : jabatan,
        password: hash,
        url: url,
        cabang_id: Number(cabang_id),
        role: role ? role : "USER",
      },
    });

    // GENERATE TOKEN
    const token = await jwt.sign(
      {
        name_app: "create user",
        user_id: postUser.id,
        nik: postUser.nik,
        cabang_id: postUser.cabang_id,
        Role: postUser.role,
        ttd: postUser.url,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1y" }
    );
    res.status(201).json({
      succes: true,
      message: "Data berhasil dibuat",
      query: postUser,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.stack,
    });
  }
};

//update
const update_user = async (req = request, res = response) => {
  try {
    const { nama, nik, hp, jabatan, password, cabang_id, status, role } =
      await req.body;

    const url =
      req.protocol + "://" + req.get("host") + "/user/" + req.file.filename;
    const { id } = await req.params;
    // hashed

    const hash = await argon2.hash(password);
    //check user dr databas

    const postUser = await Users.update({
      where: {
        id: Number(id),
      },
      data: {
        nama: nama,
        nik: nik,
        hp: hp,
        jabatan:
          role === "ADMIN" || role === "DIREKSI" || role === "MANAGER"
            ? role
            : jabatan,
        password: hash,
        url: url,
        cabang_id: Number(cabang_id),
        role: role ? role : "USER",
        status: status === 1 ? true : false,
      },
    });

    // GENERATE TOKEN
    const token = await jwt.sign(
      {
        name_app: "users",
        user_id: postUser.id,
        nik: postUser.nik,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1y" }
    );
    res.status(201).json({
      succes: true,
      message: "Data berhasil dibuat",
      query: postUser,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.stack,
    });
  }
};

//login
const login_user = async (req = request, res = response) => {
  try {
    const { nik, password } = req.body;

    // check nik
    const checkUser = await Users.findUnique({
      where: {
        nik: nik,
      },
    });
    if (!checkUser) {
      return res.status(404).json({
        status: false,
        message: "Nik tidak ditemukan",
      });
    }

    // check password

    const match = await argon2.verify(checkUser.password, password);

    if (!match) {
      return res.status(401).json({
        status: false,
        message: `password nya salah`,
      });
    }

    // generate token
    const token = await jwt.sign(
      {
        app_name: "User login",
        user_id: checkUser.id,
        user_nik: checkUser.nik,
        user_name: checkUser.nama,
        cabang_id: checkUser.cabang_id,
        Role: checkUser.role,
        ttd: checkUser.url,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1y" }
    );
    // const expireds = 86400000;

    res.status(200).json({
      status: true,
      message: "login Berhasil",
      token: token,
      // expired: expireds,
      query: checkUser,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.stack,
    });
  }
};

//? GET USER ADMIN || MGR
const get_User = async (req = request, res = response) => {
  try {
    const { limit, page, cabangs } = await req.query;
    //page
    const skip = (page - 1) * limit;
    const cabang = await Cabang.findMany();
    const resultCabang = cabang.map((e) => e.id);
    const getUser = await Users.findMany({
      where: {
        cabang_id:
          Number(cabangs) === 0 ? { in: resultCabang } : Number(cabangs),
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        nama: true,
        nik: true,
        hp: true,
        jabatan: true,
        role: true,
        url: true,
        status: true,
        cabang: {
          select: {
            nama: true,
            alamat: true,
            telp: true,
          },
        },
      },
    });
    const countPage = await Users.count();
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      current_page: parseInt(page),
      total_data: countPage,
      total_page: Math.ceil(countPage / limit),
      query: getUser,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
//!get user for cabang
const get_UserByCabang = async (req = request, res = response) => {
  try {
    const { cabang_id } = await req.body;
    const { limit, page } = await req.query;
    const skip = (page - 1) * limit;

    const getUserByCabang = await Users.findMany({
      where: {
        AND: [{ cabang_id: Number(cabang_id) }, { status: true }],
      },
      orderBy: {
        nama: "asc",
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        nama: true,
        nik: true,
        hp: true,
        jabatan: true,
        role: true,
        url: true,
        cabang: {
          select: {
            nama: true,
            alamat: true,
            telp: true,
          },
        },
      },
    });
    const countPage = await Users.count({
      where: {
        cabang_id: Number(cabang_id),
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      current_page: parseInt(page),
      total_data: countPage,
      total_page: Math.ceil(countPage / limit),
      query: getUserByCabang,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//create detail user
const detail_user = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const getIdUser = await Users.findMany({
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
      query: getIdUser,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

//GETDETAIL
const profilUser = async (req = request, res = response) => {
  try {
    const { user_id } = await req.body;

    const getprofil = await Users.findMany({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        nik: true,
        nama: true,
        hp: true,
        jabatan: true,
        url: true,
        role: true,
        status: true,
        cabang: {
          select: {
            nama: true,
          },
        },
      },
    });
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkn",
      query: getprofil,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

const userRole = async (req = request, res = response) => {
  try {
    const getRole = await users_role;
    res.status(200).json({
      succes: true,
      message: "Data berhasil ditampilkan",
      query: getRole,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

module.exports = {
  create_user,
  detail_user,
  get_User,
  login_user,
  update_user,
  get_UserByCabang,
  profilUser,
  userRole,
};
