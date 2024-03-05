const mongoose = require("mongoose");
// import module data
const Reviews = require("./review.js");
// creating schema for collection 
const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:
            "https://media.istockphoto.com/id/588953882/photo/beautiful-curb-appeal-of-two-story-house-with-large-trees.jpg?s=1024x1024&w=is&k=20&c=-iye3nyigx_c_onMCeNCxg7j2qHZx-Q9CK88-L-zn2k=",
        set:(v)=>
            v === "" ? "https://media.istockphoto.com/id/588953882/photo/beautiful-curb-appeal-of-two-story-house-with-large-trees.jpg?s=1024x1024&w=is&k=20&c=-iye3nyigx_c_onMCeNCxg7j2qHZx-Q9CK88-L-zn2k=":v
        
    },
    // reviews related to listings (ont to many Approcah 2.) 
    reviews:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"Reviews",
    }],
    owner:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
    },
    price:Number,
    location:String,
    country:String
})
// post middleware tha run after the trigerring of findOneandDelete Middleware(which is by default call by FindByIdAndDelete )
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length){
        // deleting related data of listing like review on that lisiting.
        await Reviews.deleteMany({ _id : {$in :listing.reviews}});
    }
});
// creating model Listing
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;