const express = require("express");
const session = require("express-session");
const app = express();
// session middleware ;
// our session send the session id in form of cokkie to store on webbrowser and secret make cookie signed
// resave : false because if there is no change in seesion data then no need to resave the session
app.use(session({secret:"mySuperSecret" , resave:false , saveUninitialized:true }));
app.get("/",(req , res)=>{
    if(req.session.count ){
        req.session.count++ ;
    }
    else{
        // creating variable count and store in session. to check how much time same request send in a session
        req.session.count = 1 ;
    }
    res.send(`${req.session.count} no of time request sent`);
})

app.listen(3000 , ()=>{
    console.log("connection sucessful");
})
