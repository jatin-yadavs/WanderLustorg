const express = require("express");
const router =express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserror = require("../utils/Expresserror.js");
const { listingSchema , reviewSchema} = require("../Schema.js");
// middleware that is authenticated the user
const { isLoggedIn , isOwner , validateListing } = require("../middleware.js");


// index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));
// new route
// middleware that is authenticated the user paased as argument
router.get("/new", isLoggedIn ,  (req, res) => {
    res.render("listings/new.ejs");
})
// Show route
router.get("/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        // create message 
        req.flash("error","The listing you tried to acess is not there");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));
// saving new Listing by form or create route
// passing validatelisting as middle ware to validate the listing object that  come from form on postman request
// middleware that is authenticated the user paased as argument
router.post("/", isLoggedIn , validateListing,
 wrapAsync(async (req, res , next)=>{
    const newListing = new Listing(req.body.listing);
    // make loggedin user the  owner of newly created listing 
    newListing.owner = req.user._id;
    await newListing.save();
    console.log(newListing);
    // creating new flash
    req.flash("success","New Listing Created");
    res.redirect("/listings");
})
);
//Delete the Listing

// middleware that is authenticated the user paased as argument
router.delete("/:id", isLoggedIn ,isOwner , wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Deleted sucessfully");
    res.redirect("/listings");

}));

// Edit route

// middleware that is authenticated the user paased as argument
router.get("/:id/edit",isLoggedIn , isOwner , wrapAsync( async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","The listing you tried to edit is not there");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));
//Update route

// middleware that is authenticated the user paased as argument
router.put("/:id",isLoggedIn , isOwner , validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Update sucessfuly");
    res.redirect(`/listings/${id}`);
}));



module.exports = router;

