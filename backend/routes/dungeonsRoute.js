const express = require('express');
const router = express.Router();
const dungeonsController = require('../controllers/dungeonsController');


// Routes pour les donjons
router.get('/', dungeonsController.getAllDungeons);

module.exports = router;