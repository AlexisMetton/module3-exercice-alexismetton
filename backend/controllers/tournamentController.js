const Tournament = require("../models/tournamentModel");

module.exports = {
  getAllTournaments: async (req, res) => {
    try {
      const tournaments = await Tournament.getAllTournaments();
      res.status(200).json({ success: true, tournaments });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des tournois." });
    }
  },

  createTournament: async (req, res) => {
    try {
      const newTournament = await Tournament.createTournament(req.body);
      res.status(201).json({ success: true, tournament: newTournament });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la création du tournoi." });
    }
  },

  updateTournament: async (req, res) => {
    try {
        console.log("Données reçues pour la création du tournoi :", req.body, req.params.id);
        
      const updatedTournament = await Tournament.updateTournament(req.params.id, req.body);
      res.status(200).json({ success: true, tournament: updatedTournament });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la mise à jour du tournoi." });
    }
  },

  deleteTournament: async (req, res) => {
    try {
      await Tournament.deleteTournament(req.params.id);
      res.status(200).json({ success: true, message: "Tournoi supprimé" });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la suppression du tournoi." });
    }
  },

  getTournamentDetails: async (req, res) => {
    try {
        const { id } = req.params;
        const tournament = await Tournament.getTournamentById(id);
        if (!tournament) {
          return res.status(404).json({ success: false, error: "Tournoi introuvable." });
        }
  
        const teams = await Tournament.getTournamentTeams(id);
        const ranking = await Tournament.getTournamentRanking(id);
        const cashPrize = await Tournament.getCashPrize(id);
  
        res.status(200).json({ success: true, tournament, teams, ranking, cashPrize });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des détails du tournoi." });
    }
  },

  getTournamentById: async (req, res) => {
    try {
      const { id } = req.params;
      const tournament = await Tournament.getTournamentById(id);

      if (!tournament) {
        return res.status(404).json({ success: false, error: "Tournoi introuvable." });
      }

      res.status(200).json({ success: true, tournament });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la récupération du tournoi." });
    }
  },

  addTeamToTournament: async (req, res) => {
    try {
      const { parties_id } = req.body;
      const { id: tournament_id } = req.params;

      if (!parties_id) {
        return res.status(400).json({ success: false, error: "L'ID de l'équipe est requis." });
      }

      await Tournament.addTeamToTournament(tournament_id, parties_id);
      res.status(200).json({ success: true, message: "Équipe ajoutée au tournoi avec succès." });
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'équipe au tournoi :", err);
      res.status(500).json({ success: false, error: "Erreur lors de l'ajout de l'équipe au tournoi." });
    }
  },

  addDungeonTime: async (req, res) => {
    try {
      const { parties_id, dungeon_id, completion_time } = req.body;
      const { id: tournament_id } = req.params;

      if (!parties_id || !dungeon_id || !completion_time) {
        return res.status(400).json({ success: false, error: "Données incomplètes pour l'ajout du temps." });
      }

      const dungeonTime = await Tournament.addDungeonTime(tournament_id, parties_id, dungeon_id, completion_time);

      if (!dungeonTime.valid) {
        return res.status(400).json({ success: false, error: "Le temps est dépassé, invalidé." });
      }

      res.status(201).json({ success: true, message: "Temps ajouté avec succès.", dungeonTime });
    } catch (err) {
      console.error("Erreur lors de l'ajout du temps de donjon :", err);
      res.status(500).json({ success: false, error: "Erreur lors de l'ajout du temps de donjon." });
    }
  },

  getTeamToTournament: async (req, res) => {
    try {
      const { id: tournament_id } = req.params;

      if (!tournament_id) {
        return res.status(400).json({ success: false, error: "L'ID de l'équipe est requis." });
      }

      const parties = await Tournament.getTeamToTournament(tournament_id);
      res.status(200).json({ success: true, parties });
    } catch (err) {
      console.error("Erreur lors de la récupération de l'équipe :", err);
      res.status(500).json({ success: false, error: "Erreur lors de la récupération de l'équipe." });
    }
  },

  removeTeamFromTournament: async (req, res) => {
    try {
      const { id: tournament_id, teamId } = req.params;
  
      await Tournament.removeTeamFromTournament(tournament_id, teamId);
      res.status(200).json({ success: true, message: "Équipe supprimée avec succès." });
    } catch (err) {
      console.error("Erreur lors de la suppression de l'équipe :", err);
      res.status(500).json({ success: false, error: "Erreur lors de la suppression de l'équipe." });
    }
  },

  getDungeonTimes: async (req, res) => {
    try {
      const { id: tournament_id } = req.params;
  
      const dungeonTimes = await Tournament.getDungeonTimes(tournament_id);
  
      if (!dungeonTimes || dungeonTimes.length === 0) {
        return res.status(404).json({ success: false, error: "Aucun temps enregistré pour ce tournoi." });
      }
  
      res.status(200).json({ success: true, dungeonTimes });
    } catch (err) {
      console.error("Erreur lors de la récupération des temps des donjons :", err);
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des temps des donjons." });
    }
  },
};
