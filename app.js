const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const Expresserror = require("./utils/Expresserror.js");
const { listingSchema , reviewSchema} = require("./Schema.js");
const Reviews = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// require session
const session = require("express-session");
// require flash
const flash = require("connect-flash");
const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
// for method override
app.use(methodOverride("_method"));
//for ejs mate
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

// options for session

const sessionOptions = {
    secret:"mySuperSecret",
    resave:false ,
    saveUninitialized:true,
    // setting cookie expiry date.
    cookie:{
        expires: Date.now() + 7 * 24 * 60  * 60 * 1000,
        maxAge: 7 * 24 * 60  * 60 * 1000,
        httpOnly:true
    },
};

// root route
app.get("/", (req, res) => {
    res.send("hello this is major project -- > send the request to  /listings ");
});

// using session middleware .
app.use(session(sessionOptions));

// use flash middleware 
app.use(flash());
// initialise passport for authentication
app.use(passport.initialize());
// passport.session() is used to know about the seesion in which single user perform.
app.use(passport.session());
// to use passport - local strategy(ki kiss scheme se login krana hai)
passport.use(new LocalStrategy(User.authenticate()));
// to store  , that user does in particular session
passport.serializeUser(User.serializeUser());
// to remove  that   user does in particular session after session over.
passport.deserializeUser(User.deserializeUser());

// make sucess varible for all templeting files
app.use((req , res , next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.CurrUser = req.user;
    next();
})

app.get("/demouser",wrapAsync(async(req , res)=>{
    let fakeuser = new User({
        email:"tusharyadav@gmail.com",
        username:"tunta",
    })
    // this register save unique user in data-base( if the user already exit then it not register user again)
    // this register is static function of passwor-local-mongoose
    // It help to store user in database 
    let registeredUser = await User.register(fakeuser,"helloworld");
    res.send(registeredUser);
}));



// use listing route when call to like /listings.
app.use("/listings",listingRouter);

// use reviews route when call to like /listings/:id/reviews.
app.use("/listings/:id/reviews",reviewRouter);
// for user route
app.use("/",userRouter);

//connect to database and work with Work with wanderLust database
const Mongo_Url = "mongodb://127.0.0.1:27017/wanderLust";
// connecting to database
main().then(() => {
    console.log("Sucessfully connected to database");
})
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(Mongo_Url);
}


app.all("*" , (req , res , next)=>{
    next(new Expresserror(404 ,"Page Not Found!"));
})
// middleWare to Handle Error
app.use((err,req,res,next)=>{
    let {statusCode = 500 , message="Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs" , {message});
});
app.listen(80, () => {
    console.log("server is listeaning on port 80...");
})


