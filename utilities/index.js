const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => { 
            grid += '<li>'
            grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
            + 'details"><img src="' + vehicle.inv_thumbnail 
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$' 
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } 

    else { 
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
        }
        return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Add buildVehicleHtml to utilities/index.js 
* to format the vehicle data into an HTML string:
 **************************************** */

Util.buildDetailView = async (data) => {
    let markup = "<div class=\"vehicle-detail\">"
    markup += `<img src="${data.inv_image}" alt="a picture of a ${data.inv_year} ${data.inv_make} ${data.inv_model}">`
    markup += '<div class="detail">'
    + `<div class="detail-header">${data.inv_year} ${data.inv_make} ${data.inv_model} Details</div>`
    + "<ul>"
    + `<li>Price: $${new Intl.NumberFormat('en-US').format(data.inv_price)}</li>`
    + `<li>Description: ${data.inv_description}</li>`
    + `<li>Color: ${data.inv_color}</li>`
    + `<li>Mileage: ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</li>`
    + "</ul>"
    + "</div>"
    markup += "</div>"

    return markup
}

/* **************************************
 * Build the classification list
 * ************************************ */

Util.buildClassificationList = async function(classification_id = null) {
	let data = await invModel.getClassifications()
	let classificationList =
		'<select name="classification_id" id="classificationList" required>'
	classificationList += "<option value=''>Choose a Classification</option>"
	data.rows.forEach((row) => {
		classificationList += '<option value="' + row.classification_id + '"'
		if (
			classification_id != null &&
			row.classification_id == classification_id
		) {
			classificationList += " selected "
		}
		classificationList += ">" + row.classification_name + "</option>"
	})
	classificationList += "</select>"
	return classificationList
}


module.exports = Util