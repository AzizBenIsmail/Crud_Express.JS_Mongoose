const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  fullName: String, //1squeltte
  phone: Number,
});
const contact = mongoose.model("Contact", contactSchema); //transfer to collection
module.exports = contact;
