// Needed Resources 
const express = require("express") //scope of the file
const router = new express.Router() //create a new Router object
const invController = require("../controllers/invController")
//brings the inventory controller into this router document's scope to be used.

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;
