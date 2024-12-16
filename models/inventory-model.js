const pool = require("../database/") //imports the database connection 

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch(error) {
        console.error("getclassificationbyid error " + error)
    }
}


async function getDetailsByInventoryId (inventoryId) {
    try {
      const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1", [inventoryId])
        return data.rows[0]
        } catch (error) {
        console.error("getdetailsbyinventoryid error " + error)
    }
}

/* ***************************
 *  Add classification to database
 * ************************** */

const addClassificationToDatabase = async (classification_name) => {
	try {
		const results = await pool.query("INSERT INTO public.classification (classification_name) VALUES ($1)", [classification_name])
		return true
	} catch (error) {
		console.error("addClassification error " + error)
		return error
	}
}

/* ***************************
 *  Add car inventory to database
 * ************************** */

const addInventoryToDatabase = async (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) => {
	try {
		const results = await pool.query("INSERT INTO public.inventory VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [
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
		])
		return true
	} catch (error) {
		console.error("addInventory error " + error)
		return error
	}
}

/* ***************************
 *  Update vehicle in inventory table
 * ************************** */

const updateInventory = async (inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) => {
	try {
	  const results = await pool.query("UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *", [
		inv_make, 
		inv_model, 
		inv_year, 
		inv_description, 
		inv_image, 
		inv_thumbnail, 
		inv_price, 
		inv_miles, 
		inv_color, 
		classification_id,
		inv_id,
	  ])
	  return results.rows[0]
	} catch (error) {
	  console.error("updateInventory error " + error)
	  return error
	}
  }
  
  /* ***************************
   *  Delete vehicle from inventory table
   * ************************** */
  
  const deleteInventory = async (inv_id) => {
	try {
	  const data = await pool.query("DELETE FROM public.inventory WHERE inv_id = $1", [
		inv_id,
	  ])
	  return data
	} catch (error) {
	  console.error("deleteInventory " + error)
	  return error
	}
  }
  
 /* ***************
  * Add new review
  ************** */
 async function addReviewData (
    review_id, 
    review_text,
    inv_id,
    account_id
    ){
    try {
      const sql = `INSERT INTO public.review
      (review_id, review_text,inv_id, account_id) 
      VALUES ($1,$2, $3, $4) RETURNING*`
      const data = await pool.query(sql, [
        review_id,
        review_text,
        inv_id,
        account_id
      ]) 
      return data.rows
      } catch (error) {
      return error.message
    }
    }  



module.exports = {getClassifications, getInventoryByClassificationId, getDetailsByInventoryId, addClassificationToDatabase, addInventoryToDatabase, updateInventory, deleteInventory,addReviewData};