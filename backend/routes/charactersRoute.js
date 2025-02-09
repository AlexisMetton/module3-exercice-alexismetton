const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');


// Routes pour les characters
router.get('/', characterController.getAllCharacters);
router.post('/', characterController.createCharacter);
router.put('/:id', characterController.updateCharacter);
router.delete('/:id', characterController.deleteCharacter);

router.get('/:id', characterController.getCharacterById);

module.exports = router;