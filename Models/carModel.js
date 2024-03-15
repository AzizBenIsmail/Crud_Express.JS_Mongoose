const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Référence vers l'utilisateur
}, { timestamps: true });

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
