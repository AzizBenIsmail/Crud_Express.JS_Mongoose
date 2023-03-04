const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema(
    {
        fullName: String,
        phone:Number
    }
);
const contact = mongoose.model("Contact", contactSchema);
module.exports=contact;