const { throwError } = require("../controllers/errorController");
const { handleErrors } = require("../utilities");

const router = require("express").Router();

router.get("/error", handleErrors(throwError))

module.exports = router