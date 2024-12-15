const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
*  Inventory Classification Validation Rules
* ********************************* */

validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .matches(/^[a-zA-Z0-9\s-]+$/) // Allow letters, numbers, spaces, and hyphens
        .withMessage("Classification must not be empty and cannot have spaces or special characters.")
    ]
}


/* ******************************
 * Check classification and return errors or continue to classification process
 * ***************************** */

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }

    next()
}

/*  **********************************
*  Inventory Data Validation Rules
* ********************************* */

validate.inventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Make cannot be empty"),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Model cannot be empty"),

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("Year cannot be empty and can only contain numebers."),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Description must not be empty"),

        body("inv_image")
        .trim()
        .escape()
        .optional(),

        body("inv_thumbnail")
        .trim()
        .escape()
        .optional(),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("Price cannot be empty and can only contain numbers."),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("Miles cannot be empty and can only contain numbers."),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Color cannot be empty."),

        body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Classification must not be empty and cannot have spaces or special characters."),
    ]
}

/* ******************************
 * Check inventory and return errors or continue to inventory process
 * ***************************** */

validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year } = req.body
    let classificationList = await utilities.buildClassificationList()
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add Inventory",
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

module.exports = validate
