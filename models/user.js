const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    pic:{
        type:String,
        default:"https://res.cloudinary.com/krishna-cloud/image/upload/v1596264127/default_d2e3bm.jpg"
    },
    about:{
        type:String,
        default:"New to Instagram-clone"
    },
    saved:[{
        type:ObjectId,
        ref:"Post"
    }]
    
})

mongoose.model("User",userSchema);