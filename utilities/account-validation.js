const utilities = require(".")
const {
	body,
	validationResult
} = require("express-validator")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
	return [

		body("account_firstname")
		.trim()
		.escape()
		.notEmpty()
		.isLength({
			min: 1
		})
		.withMessage("Please provide a first name."),

		body("account_lastname")
		.trim()
		.escape()
		.notEmpty()
		.isLength({
			min: 2
		})
		.withMessage("Please provide a last name."),

		// 
		body("account_email")
		.trim()
		.escape()
		.notEmpty()
		.isEmail()
		.normalizeEmail()
		.withMessage("A valid email is required.")
		.custom(async (account_email) => {
			const emailExists = await accountModel.checkExistingEmail(account_email)
			if (emailExists) {
				throw new Error("Email exists. Please log in or use different email")
			}
		}),


		body("account_password")
		.trim()
		.notEmpty()
		.isStrongPassword({
			minLength: 12,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage("Password does not meet requirements."),
	]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
	const {
		account_firstname,
		account_lastname,
		account_email
	} = req.body
	let errors = []
	errors = validationResult(req)
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav()
		res.render("account/register", {
			errors,
			title: "Registration",
			nav,
			account_firstname,
			account_lastname,
			account_email,
		})
		return
	}
	next()
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
	return [
		body("account_email")
		.trim()
		.escape()
		.notEmpty()
		.isEmail()
		.normalizeEmail() // refer to validator.js docs
		.withMessage("A valid email is required."),
		// password is required and must be strong password

		body("account_password")
		.trim()
		.notEmpty()
		.isStrongPassword({
			minLength: 12,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage("Password does not meet requirements."),
	]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
	const {
		account_email
	} = req.body
	let errors = []
	errors = validationResult(req)
	if (!errors.isEmpty()) {
		let nav = await utilities.getNav()
		res.render("account/login", {
			errors,
			title: "Login",
			nav,
			account_email,
		})
		return
	}
	next()
}

/* ******************************
 * Check inventory and return to edit view if there are errors
 * ***************************** */

validate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_id } = req.body
    let classificationList = await utilities.buildClassificationList()
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/edit-inventory", {
            errors,
            title: `Editing ${ inv_make } ${ inv_model }`,
            nav,
            classificationList,
            inv_make,
            inv_model,
            inv_year,
        })
        return
    }

    next()
}



/*  **********************************
*  Update Data Validation Rules
* ********************************* */
validate.updateInformationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email, { req }) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            // Get account data from jwt since req isnt passing accountdata
            const payload = await jwt.decode(req.cookies.jwt)
            
            if (emailExists && account_email !== payload.account_email){
              throw new Error("Email exists. Please log in or use different email")
            }
          }),
    ]
}

/* ******************************
 * Check data and return errors or refresh page
 * ***************************** */
validate.checkInformationUpdateData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Update",
      nav,
    })
    return
  }
  next()
}

/*  **********************************
*  Password Validation Rules
* ********************************* */
validate.passwordRules = () => {
  return [
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage("Password does not meet requirements.")
  ]
}


module.exports = validate