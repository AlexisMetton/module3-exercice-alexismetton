const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');


// Routes pour les characters
router.get('/', teamController.getAllTeams);
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

router.get('/:id', teamController.getTeamById);

module.exports = router;