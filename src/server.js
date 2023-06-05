const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const CabangRoute = require("./route/Cabang");
const BengkelRoute = require("./route/Bengkel");
const UnitRoute = require("./route/Unit");
const KategoriRoute = require("./route/Kategori");
const UserRoute = require("./route/User");
const PartRoute = require("./route/Part");
const LkRoute = require("./route/LK");
const apvLK_ROUTE = require("./route/apvLK");
const SPK_Route = require("./route/SPK");
const APV_SPK = require("./route/apvSPK");
const ServiceRoute = require("./route/Service");
const LPLK_ROUTE = require("./route/LP_LK");
const ChartRoute = require("./route/Chart");
const Leasing_Route = require("./route/Leasing");
const Cicilan_Route = require("./route/Cicilan");

// porcess
const app = express();
const port = process.env.PORT;
//MIDDLEWARE
app.use(cors());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(express.json());
app.use(express.static("public"));

//ROUTES
app.use(CabangRoute);
app.use(BengkelRoute);
app.use(UnitRoute);
app.use(KategoriRoute);
app.use(UserRoute);
app.use(PartRoute);
app.use(LkRoute);
app.use(apvLK_ROUTE);
app.use(SPK_Route);
app.use(APV_SPK);
app.use(ServiceRoute);
app.use(LPLK_ROUTE);
app.use(ChartRoute);
app.use(Leasing_Route);
app.use(Cicilan_Route);
//listen
app.listen(port, () => {
  console.log(`server run on , ${port}`);
});
