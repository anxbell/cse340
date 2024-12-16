const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
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

Util.buildClassificationList = async function (classification_id = null) {
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
  
  /* ****************************************
  * Middleware to check token validity
  **************************************** */
  Util.checkJWTToken = (req, res, next) => {
   if (req.cookies.jwt) {
    jwt.verify(
     req.cookies.jwt,
     process.env.ACCESS_TOKEN_SECRET,
     function (err, accountData) {
      if (err) {
       req.flash("Please log in")
       res.clearCookie("jwt")
       return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
     })
   } else {
    next()
   }
  }
  
/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
      next()
    } else {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
   }
  
   /* ****************************************
   *  Validate user
   * ************************************ */
  Util.validateUser = (req, res, next) => {
    console.log(res.locals)
    if (res.locals.loggedin && (res.locals.accountData.account_type === "Admin" || res.locals.accountData.account_type === "Employee")) {
      next()
    } else {
      req.flash("notice", "You do not have permission to view this content.")
      res.redirect("/account/login")
    }
  }
  
   /* ****************************************
   *  Compare user id with account management param
   * ************************************ */
  
  Util.compareUser = (req, res, next) => {
    const account_id = req.params.account_id
    const loggedIn = res.locals.loggedin
    const isAdmin = res.locals.accountData.account_type === "Admin"
  
    if (loggedIn && (account_id === res.locals.accountData.account_id || isAdmin)) {
      next()
    } else {
      req.flash("notice", "You do not have permission to view this content.")
      res.redirect("/account/login")
    }
  }


/* **************************************
* Build new review display
* ************************************ */
Util.addNewReview = async function(data){
  let review
  if(data.length > 0) {
      review = '<ul id="inv-display">'
      data.forEach(vehicle => {
        review += `<div id="description">
          <div class="vertical-line"></div>
          <div id="item-description">
          <h1>Customer Reviews</h1>
          <h2>${vehicle.review_id}</h2>
          <p>$${new Intl.NumberFormat('en-US').format(vehicle.review_date)}</p>
          <p>${vehicle.review_text}</p>
        </ul>`
      })
      review += '</ul>'
  }
  else {
      review = '<p class="notice"> Sorry, there are no reviews.</p>'
  }
  console.log(review)
  return review
}

  
module.exports = Util