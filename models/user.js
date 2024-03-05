const mongoose = require("mongoose");
// passport - local- mongoose -> add field in schema like salt , hash , username , and also consisting of hashing function to store the password in database in form of hash value 

const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new  mongoose.Schema({
    email:{
        type:String,
        required:true
    },
})
//plugin passpportlocalmongoose in User schema.
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);