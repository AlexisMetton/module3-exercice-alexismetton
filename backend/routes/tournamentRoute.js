const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');


// Routes pour les tournaments
router.get('/', tournamentController.getAllTournaments);
router.post('/', tournamentController.createTournament);
router.delete('/:id', tournamentController.deleteTournament);
router.put('/:id', tournamentController.updateTournament);
router.get('/:id', tournamentController.getTournamentById);
router.get('/details/:id', tournamentController.getTournamentDetails);
router.post("/:id/teams", tournamentController.addTeamToTournament);
router.post("/:id/dungeon-times", tournamentController.addDungeonTime);
router.get("/:id/parties", tournamentController.getTeamToTournament);
router.get("/:id/dungeon-times", tournamentController.getDungeonTimes);
router.delete("/:id/teams/:teamId", tournamentController.removeTeamFromTournament);

module.exports = router;