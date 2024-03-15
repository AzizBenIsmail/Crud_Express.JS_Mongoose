const express = require('express');
const router = express.Router();
const CarController = require('../controllers/carController');

// Créer une nouvelle voiture
router.post('/cars', CarController.createCar);

// Lire toutes les voitures
router.get('/cars', CarController.getAllCars);

// Lire une voiture par son ID
router.get('/cars/:id', CarController.getCarById);

// Mettre à jour une voiture
router.put('/cars/:id', CarController.updateCar);

// Supprimer une voiture
router.delete('/cars/:id', CarController.deleteCar);

module.exports = router;
