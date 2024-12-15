// Needed Resources 
const express = require("express") //scope of the file
const router = new express.Router() //create a new Router object
const invController = require("../controllers/invController")
//brings the inventory controller into this router document's scope to be used.
const { buildByClassificationId, buildDetailByInvId, buildManagementView, buildNewClassificationView, addClassification, buildInventoryView, addInventory } = require("../controllers/invController");

const { handleErrors } = require("../utilities");

const { classifcationRules, checkClassificationData, inventoryRules, checkInventoryData } = require("../utilities/inventory-validation");


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildDetailByInvId);

router.get("/", handleErrors(buildManagementView))
router.get("/add-classification", handleErrors(buildNewClassificationView))
router.post("/add-classification", classifcationRules(), checkClassificationData, handleErrors(addClassification))
router.get("/add-inventory", handleErrors(buildInventoryView))
router.post("/add-inventory", inventoryRules(), checkInventoryData, handleErrors(addInventory))


module.exports = router;
