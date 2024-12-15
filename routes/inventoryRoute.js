// Needed Resources 
const express = require("express") //scope of the file
const router = new express.Router() //create a new Router object
const invController = require("../controllers/invController")
//brings the inventory controller into this router document's scope to be used.
const { buildByClassificationId, buildDetailByInvId, buildManagementView, buildNewClassificationView, addClassification, buildInventoryView, addInventory, getInventoryJSON, editInventory, updateInventory, buildDeleteView, deleteInventoryFromId} = require("../controllers/invController");

const { handleErrors } = require("../utilities");

const { classificationRules, checkClassificationData, inventoryRules, checkInventoryData, checkUpdateData } = require("../utilities/inventory-validation");


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildDetailByInvId);

router.get("/", handleErrors(buildManagementView))


// // Deliver classification addition form
router.get("/addClassification", handleErrors(buildNewClassificationView))

// // Add new classification to classifications table
router.post("/addClassification", classificationRules(), checkClassificationData, handleErrors(addClassification))

// // Deliver inventory addition form
router.get("/addInventory", handleErrors(buildInventoryView))

// // Add new vehicle to inventory
router.post("/addInventory", inventoryRules(), checkInventoryData, handleErrors(addInventory))

// // Get inventory by classification id
router.get("/getInventory/:classification_id", handleErrors(getInventoryJSON))

// // Route for editing inventory items
router.get("/edit/:inventory_id", handleErrors(editInventory))

// // Route for updaing inventory items //////
router.post("/update/", inventoryRules(), checkUpdateData, handleErrors(updateInventory))

// // Route for delivering inventory deletion view
router.get("/delete/:inventory_id", handleErrors(buildDeleteView))

// // DELETE route for deleting items from the inventory.
router.post("/delete/", handleErrors(deleteInventoryFromId))


module.exports = router;
