const Listing = require("./models/listing.js");
const Reviews = require("./models/review.js");
const Expresserror = require("./utils/Expresserror.js");
const { listingSchema  , reviewSchema} = require("./Schema.js");
// this is middleware that is authenticated the user (Is user logged in or not)
module.exports.isLoggedIn = (req , res , next)=>{
    if(!req.isAuthenticated()){
        // storing Url of what user  access before logged in .
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must Be Logged In!");
        return res.redirect("/login");
    }
    next();
}

//this middleware is created to store the above url , because when the user logged in it reset the user sesion,
module.exports.saveRedirectUrl= (req , res , next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
//  loggin user bss apni hi listing ko delete kr paye or kisi ki listing na delete kr paye isliye delete aur edit  button hide kr diye  jb curr-user(logge-in user) not match with listing owner  so hide buttons
module.exports.isOwner  = async (req , res , next)=>{
    let { id } = req.params ;
    const listing = await Listing.findById(id);
    if(! listing.owner._id.equals(res.locals.CurrUser._id)){
        req.flash("error" , "You are Not the Owner of this Listing")
        return res.redirect(`/listings/${id}`);
    }
    next();
}
//validate listing
module.exports.validateListing = (req ,res ,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        // not understand thid line
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new Expresserror(400 ,errMsg);
    }
    else{
        next();
    }
}
// validate review
module.exports.validateReview = (req ,res ,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        // not understand this line
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new Expresserror(400 ,errMsg);
    }
    else{
        next();
    }
}
// check for author of review 
module.exports.isReviewAuthor  = async (req , res , next)=>{
    let { id ,reviewId } = req.params ;
    let review = await Reviews.findById(reviewId);
    if(! review.author._id.equals(res.locals.CurrUser._id)){
        req.flash("error" , "You are Not created that review !")
        return res.redirect(`/listings/${id}`);
    }
    next();
}
