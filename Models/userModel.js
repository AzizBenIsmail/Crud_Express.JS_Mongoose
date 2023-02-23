const mongoose=require("mongoose");
userSchema = new mongoose.Schema(
    {
        name:{type :String, require : true, default :""},
        age:Number,
        moy:Number,
        address:{
            street:String,
            pays:String
        }
    },{timestamps:true}
);
const User= mongoose.model("User",userSchema);
module.exports= User;