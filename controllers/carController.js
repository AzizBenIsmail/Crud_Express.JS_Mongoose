const Car = require('../Models/carModel');
const User = require('../Models/userModel'); // Si nécessaire, importez également le modèle d'utilisateur

// Créer une nouvelle voiture
const createCar = async (req, res) => {
    try {
        const { brand, model, year, ownerId } = req.body;
        const car = new Car({ brand, model, year, owner: ownerId });
        await car.save();

        // Mettre à jour le modèle d'utilisateur avec l'ID de la voiture
        await User.findByIdAndUpdate(ownerId, { $push: { cars: car._id } });

        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lire toutes les voitures
const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find().populate('owner');
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lire une voiture par son ID
const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({ message: "Voiture introuvable" });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une voiture
const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, model, year, ownerId } = req.body;
        const car = await Car.findByIdAndUpdate(id, { brand, model, year, owner: ownerId }, { new: true });
        if (!car) {
            return res.status(404).json({ message: "Voiture introuvable" });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une voiture
const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findByIdAndDelete(id);
        if (!car) {
            return res.status(404).json({ message: "Voiture introuvable" });
        }

        // Supprimer l'ID de la voiture de la liste des voitures de l'utilisateur
        await User.updateMany({}, { $pull: { cars: car._id } });

        res.status(200).json({ message: "Voiture supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCar, getAllCars, getCarById, updateCar, deleteCar };
