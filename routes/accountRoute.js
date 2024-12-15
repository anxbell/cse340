const app = require('express')
const router = app.Router()
const utilities = require("../utilities/index")
const account = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get('/login', utilities.handleErrors(account.buildLogin)) //validating

router.get('/register', utilities.handleErrors(account.buildRegister))

router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(account.registerAccount))


// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(account.accountLogin)
  )
  
  // Account management route
  router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(account.buildManagement)
  )
  
  // Log out route
  router.get(
    "/logout",
    utilities.handleErrors(account.accountLogout)
  )
  
  // Deliver information view
  router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(account.buildUpdateView)
  )
  
  // Account information update route
  router.post(
    "/update/information",
    regValidate.updateInformationRules(),
    regValidate.checkInformationUpdateData,
    utilities.handleErrors(account.updateAccountInformation)
  )
  
  // Account password update route
  router.post(
    "/update/password",
    regValidate.passwordRules(),
    regValidate.checkInformationUpdateData,
    utilities.handleErrors(account.updateAccountPassword)
  )

  
module.exports = router

