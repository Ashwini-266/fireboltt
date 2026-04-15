const mongoos= require('mongoose')

const ProductSchema=new mongoos.Schema({
    title:String,
    imageUpload:String,
    category:String,
    description:String,
    price:Number,
    quantity:Number,
    rating:Number,
});

module.exports=mongoos.model("products",ProductSchema);
