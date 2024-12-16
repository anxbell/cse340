// Needed Resources 
const express = require("express") //scope of the file
const router = new express.Router() //create a new Router object
const invController = require("../controllers/invController")
//brings the inventory controller into this router document's scope to be used.
const { buildByClassificationId, buildDetailByInvId, buildManagementView, buildNewClassificationView, addClassification, buildInventoryView, addInventory, getInventoryJSON, editInventory, updateInventory, buildDeleteView, deleteInventoryFromId, review} = require("../controllers/invController");

const { handleErrors, validateUser } = require("../utilities");

const { classificationRules, checkClassificationData, inventoryRules, checkInventoryData, checkUpdateData } = require("../utilities/inventory-validation");


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildDetailByInvId);

// Route to post a review
router.post("/detail/postedReview", validateUser, handleErrors(invController.review));

router.get("/", validateUser, handleErrors(buildManagementView))

// // Deliver classification addition form
router.get("/addClassification", validateUser, handleErrors(buildNewClassificationView))

// // Add new classification to classifications table
router.post("/addClassification", validateUser, classificationRules(), checkClassificationData, handleErrors(addClassification))


// // Deliver inventory addition form
router.get("/addInventory", validateUser, handleErrors(buildInventoryView))

// // Add new vehicle to inventory
router.post("/addInventory", validateUser, inventoryRules(), checkInventoryData, handleErrors(addInventory))

// // Get inventory by classification id
router.get("/getInventory/:classification_id", validateUser, handleErrors(getInventoryJSON))

// // Route for editing inventory items
router.get("/edit/:inventory_id", validateUser, handleErrors(editInventory))

// // Route for updaing inventory items //////
router.post("/update", validateUser, inventoryRules(), checkUpdateData, handleErrors(updateInventory))

// // Route for delivering inventory deletion view
router.get("/delete/:inventory_id", validateUser, handleErrors(buildDeleteView))

// Route for deleting items from the inventory.
router.post("/delete/", validateUser, handleErrors(deleteInventoryFromId))




module.exports = router;
