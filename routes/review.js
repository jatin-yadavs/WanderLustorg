const express = require("express");
// use mergeParams : true to take id from request to this page.because the id that is in request not come in routers from app.js
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserror = require("../utils/Expresserror.js");
const { reviewSchema } = require("../Schema.js");
const Reviews = require("../models/review.js");
let { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");



// storing review in database from form 
// passing validateReview as middle ware to validate the review object that  come from form on postman request
router.post("/", isLoggedIn ,  validateReview , wrapAsync(async(req , res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(newReview);
    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing.id}`);
}));

// Deleting Review
router.delete("/:reviewId", isLoggedIn ,isReviewAuthor,wrapAsync(async(req , res)=>{
    let {id , reviewId} = req.params;
    // removing id of review from listing 
    // pull is used to remove id of review from listing reviews
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    // deleting review.
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}));
module.exports = router;
