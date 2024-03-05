const express = require("express");
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const router = express.Router();

// signup form
router.get("/signup",(req ,res)=>{
    res.render("users/signup.ejs");
})
// registerUser
router.post("/signup",wrapAsync(async(req , res)=>{
    try{
        //try catch use kr rhe hai to give only flash when the user is already registerd(only reason)
        let{username , password , email} = req.body;
        const newUser = new User({username , email});
        const registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        
        // automatically login user when it signup (jab user login hota hai tabhi registereduser req.user mein assign hota hai);
        // this function is given by passport it call authenticate function automatically and assign registerd user to req.user
        req.login(registeredUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome To WanderLust!");
            res.redirect("/listings");

        });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));
// login form
router.get("/login",(req , res)=>{
    res.render("users/login.ejs");
})
//  authenticate user 
//saveRedirect middleware is created to store the url which user acess before logged in  , because when the user logged in it reset the  sesion,
router.post(
    "/login",
    saveRedirectUrl,
    //  passport library authenticate user 
    passport.authenticate("local",{
        // if valid then redirect to login page
        failureRedirect:"/login",
        // if fail show flash error
        failureFlash:true,
    }),
    // if success
    async(req , res)=>{
        req.flash("success","Welcome Back To wanderLust! You are Logged in");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

// logout route. 
router.get("/logout", (req ,res , next )=>{
    // logout function is because of passport (this logout user and define callback inside it to define what to do when users logout)
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged Out!");
        res.redirect("/listings");
    });
})
module.exports = router;