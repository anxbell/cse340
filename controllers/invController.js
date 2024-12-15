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
/* ***************************
 *  Build inventory by detail view
 * ************************** */

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
    const classificationSelect = await utilities.buildClassificationList()
  
    res.render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect
    })
  }
  
  /* ***************************
   *  Build classification management view
   * ************************** */
  
  invCont.buildNewClassificationView = async (req, res, next) => {
    let nav = await utilities.getNav()
  
    res.render("./inventory/add-classification", {
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
  
    res.render("./inventory/add-inventory", {
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
  
    res.redirect("/inv/addClassification")
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
  
    res.redirect("/inv/addInventory")
  }

  /* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Edit inventory route
 * ************************** */
invCont.editInventory = async (req, res, next) => {
  const inventory_id = parseInt(req.params.inventory_id)
  const nav = await utilities.getNav()
  const itemData = await invModel.getDetailsByInventoryId(inventory_id)
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const name = `${ itemData.inv_make } ${ itemData.inv_model }`

  res.render("./inventory/edit-inventory", {
    title: `Editing ${ name }`,
    nav,
    errors: null,
    classificationList: classificationList,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
      title: "Editing " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      })
    }
  } catch (error) {
    console.error("updateInventory " + error)
  }
}

/* ***************************
 *  Deliver inventory deletion view
 * ************************** */
invCont.buildDeleteView = async (req, res) => {
  const inventory_id = parseInt(req.params.inventory_id)
  const nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_price } = await invModel.getDetailsByInventoryId(inventory_id)
  
  res.render("./inventory/delete-confirm", {
    title: "Delete Confirmation - " +`${ inv_year } ${ inv_make } ${ inv_model }`,
    nav,
    errors: null,
    inv_id: inventory_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price
  })
}

/* ***************************
 *  Route for deleting items from the inventory
 * ************************** */
invCont.deleteInventoryFromId = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const inv_id = req.body.inv_id
    const result = await invModel.deleteInventory(inv_id)

    if (result) {
      req.flash("notice", `The item was successfully deleted.`)
      res.redirect("/inv/")
    } else {
      const itemData = await invModel.getDetailsByInventoryId(inventory_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", `Sorry, the delete for ${ itemName } failed.`)
      res.status(501).render("inventory/delete-confirm", {
      title: "Delete Confirmation",
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      })
    }
  } catch (error) {
    console.error("deleteInventory " + error)
  }
}

module.exports = invCont