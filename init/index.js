const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js");
//connect to database and work with Work with wanderLust database
const Mongo_Url = "mongodb://127.0.0.1:27017/wanderLust";
//connect to database
main().then(()=>{
    console.log("Sucessfully connected to database");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(Mongo_Url);
}
// innitialize database by data that is taken by module data
const init = async()=>{
    await Listing.deleteMany({});
    // har ek listing ke sath  by default owner add kr de rhe hai using map 
    initData.data = initData.data.map((obj)=>({...obj , owner: '65d4a5e08ce237eed7c73f76'}));
    await Listing.insertMany(initData.data);
}
init();