const app = require('express')
const router = app.Router()
const utilities = require("../utilities/index")
const account = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get('/login', utilities.handleErrors(account.buildLogin))
router.get('/register', utilities.handleErrors(account.buildRegister))
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(account.registerAccount))

module.exports = router