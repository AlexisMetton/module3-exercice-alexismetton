const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');


// Routes pour les characters
router.post("/by-ids", characterController.getCharactersByIds);
router.get('/team', characterController.getCharactersForTeam);
router.get('/', characterController.getAllCharacters);
router.post('/', characterController.createCharacter);
router.put('/:id', characterController.updateCharacter);
router.delete('/:id', characterController.deleteCharacter);
router.get('/:id', characterController.getCharacterById);


module.exports = router;