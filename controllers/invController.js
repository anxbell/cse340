const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function(req, res, next) {
	const classification_id = req.params.classificationId
	const data = await invModel.getInventoryByClassificationId(classification_id)
	const grid = await utilities.buildClassificationGrid(data)
	let nav = await utilities.getNav()
	const className = data[0].classification_name
	res.render("./inventory/classification", {
		title: className + " vehicles",
		nav,
		grid,
	})
}

invCont.buildDetailByInvId = async (req, res, next) => {
	const inventoryId = req.params.inventoryId
	const data = await invModel.getDetailsByInventoryId(inventoryId)
	const grid = await utilities.buildDetailView(data)
	let nav = await utilities.getNav()

	res.render("./inventory/detail", {
		title: `${data.inv_make} ${data.inv_model}`,
		nav,
		grid
	})
}

/* ***************************
 *  Build inventory management view
 * ************************** */

invCont.buildManagementView = async (req, res, next) => {
    let nav = await utilities.getNav()
    // req.flash("notice", "''")
  
    res.render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  }
  
  /* ***************************
   *  Build classification management view
   * ************************** */
  
  invCont.buildNewClassificationView = async (req, res, next) => {
    let nav = await utilities.getNav()
  
    res.render("./inventory/addClassification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
  
  /* ***************************
   *  Build inventory management view
   * ************************** */
  
  invCont.buildInventoryView = async (req, res) => {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
  
    res.render("./inventory/addInventory", {
      title: "Add Inventory",
      classificationList,
      nav,
      errors: null,
    })
  }
  
  /* ***************************
   *  Add classification route
   * ************************** */
  
  invCont.addClassification = async (req, res) => {
    const { classification_name } = req.body
    console.log(req.body)
    let result = await invModel.addClassificationToDatabase(classification_name)
  
    if (result === true) {
      req.flash("notice", `Classification "${ classification_name }" was inserted successfully.`)
    } else {
      req.flash("notice", `Something went wrong while adding "${ classification_name  }" to the database. ${ result }`)
    }
  
    res.redirect("/inv/management/addClassification")
  }
  
  /* ***************************
   *  Add inventory route
   * ************************** */
  
  invCont.addInventory = async (req, res) => {
    let { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    console.log(req.body)
    if (!inv_image) {
      inv_image = "/images/vehicles/no-image.png"
    }
  
    if (!inv_thumbnail) {
      inv_thumbnail = "/images/vehicles/no-image-tn.png"
    }
    let result = await invModel.addInventoryToDatabase(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  
    if (result === true) {
      req.flash("notice", `Inventory "${ inv_year } ${ inv_make } ${ inv_model }" was inserted successfully.`)
    } else {
      req.flash("notice", `Something went wrong while adding "${ inv_year } ${ inv_make } ${ inv_model }" to the database. ${ result }`)
    }
  
    res.redirect("/inv/management/addInventory")
  }
module.exports = invCont