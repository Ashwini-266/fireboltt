const mangoose=require('mongoose');

const userSchema=new mangoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
},
{ timestamps: true }
);

const UserModel=mangoose.model("users",userSchema)
module.exports=UserModel;