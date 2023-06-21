const express = require("express");
const {
  create_user,
  detail_user,
  get_User,
  login_user,

  get_Role,

  update_user,
  get_UserByCabang,
  profilUser,
  userRole,
  create_akun,
} = require("../controller/User");

const checkToken = require("../middleware/checkToken");
const uploadUser = require("../middleware/uploadUser");
const UserRoute = express.Router();

UserRoute.post("/user/register", uploadUser.single("ttd"), create_user);
UserRoute.put("/user/:id", uploadUser.single("ttd"), update_user);
UserRoute.post("/user/login", login_user);

//getfor admin
UserRoute.get("/user", checkToken, get_User);
//get for user
UserRoute.get("/users", checkToken, get_UserByCabang);
UserRoute.get("/user/:id", detail_user);
UserRoute.get("/profiluser", checkToken, profilUser);
UserRoute.get("/role", userRole);

module.exports = UserRoute;
