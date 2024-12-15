const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
  //   req.flash("notice", "This is a flash message.")
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  
  /* ****************************************
  *  Deliver registration view
  * *************************************** */
  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
  
  /* ****************************************
  *  Process Registration
  * *************************************** */
  async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
    console.log(hashedPassword)
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }
  
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Account logout controller
* *************************************** */

const accountLogout = async (req, res) => {

  if (req.cookies["jwt"]) {
    res.clearCookie("jwt")
    req.flash("notice", "Account successfully logged out.")
  } else {
    req.flash("notice", "You are not currently signed in.")
  }

  res.redirect("../")
}



/* ****************************************
*  Deliver account view
* *************************************** */
const buildManagement = async (req, res) => {
  const nav = await utilities.getNav()
  res.render("account/account", {
    title: "My Account",
    nav,
    errors: null,
  })
}
/* ****************************************
*  Deliver account information
* *************************************** */

const buildUpdateView = async (req, res, next) => {
  const nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Update account information
* *************************************** */

const updateAccountInformation = async (req, res) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const results = await accountModel.updateAccountInformationById(account_id, account_firstname, account_lastname, account_email)

  if (results) {
    req.flash("notice", "Your account information was updated successfully!")
    req.flash("notice", `First name: ${ results.account_firstname }</br>Last name: ${ results.account_lastname }</br>Email address: ${ results.account_email }`)

    // console.log(res.locals)
    // res.locals.accountData.account_firstname = results.account_firstname
    // res.locals.accountData.account_lastname = results.account_lastname
    // res.locals.accountData.account_email = results.account_email
    // console.log(res.locals)

    res.redirect(`/account`)
  } else {
    req.flash("notice", "Something went wrong while updating your account information.")
    res.redirect(`/account/update/${ account_id }`)
  }
}

/* ****************************************
*  Update account password
* *************************************** */

const updateAccountPassword = async (req, res) => {
  const { account_id, account_password } = req.body

  // Hash the password before updating
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the update.')
    res.status(500).render(`/account/update/${ account_id }`, {
      title: "Update",
      nav,
      errors: null,
    })
    return
  }

  const results = accountModel.updateAccountPasswordById(account_id, hashedPassword)

  if (results) {
    req.flash("notice", "Your password was updated successfully!")
    res.redirect(`/account`)
  } else {
    req.flash("notice", "Something went wrong while updating your password.")
    res.redirect(`/account/update/${ account_id }`)
  }
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildManagement, 
  accountLogout, 
  buildUpdateView,
  updateAccountInformation,
  updateAccountPassword
}