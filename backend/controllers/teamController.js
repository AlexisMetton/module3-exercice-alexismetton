const Team = require("../models/teamModel");

module.exports = {
  getAllTeams: async (req, res) => {
    try {
      const teams = await Team.getAllTeams();
      res.status(200).json({ success: true, teams });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des équipes." });
    }
  },

  createTeam: async (req, res) => {
    try {
      const { name, playerIds } = req.body;
      if (!name || !playerIds || playerIds.length !== 5) {
        return res.status(400).json({ success: false, error: "Données invalides ou incomplètes." });
      }
      
      const newTeam = await Team.createTeam({ name, playerIds });
      res.status(201).json({ success: true, message: "Équipe créée avec succès.", team: newTeam });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la création de l'équipe." });
    }
  },

  updateTeam: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, playerIds } = req.body;
      if (!name || !playerIds || playerIds.length !== 5) {
        return res.status(400).json({ success: false, error: "Données invalides ou incomplètes." });
      }
      
      const updatedTeam = await Team.updateTeam(id, { name, playerIds });
      res.status(200).json({ success: true, message: "Équipe mise à jour avec succès.", team: updatedTeam });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la mise à jour de l'équipe." });
    }
  },

  deleteTeam: async (req, res) => {
    try {
      const { id } = req.params;
      await Team.deleteTeam(id);
      res.status(200).json({ success: true, message: "Équipe supprimée." });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la suppression de l'équipe." });
    }
  }
};
