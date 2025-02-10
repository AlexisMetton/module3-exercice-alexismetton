const Character = require("../models/characterModel");

module.exports = {
  getAllCharacters: async (req, res) => {
    try {
      const characters = await Character.getAllCharacters();
      res.status(200).json({
        success: true,
        characters,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des characters.",
      });
    }
  },

  createCharacter: async (req, res) => {
    try {
      const { name, class_ID, role_ID, ilvl, rio } = req.body;

      if (!name || !class_ID || !role_ID || ilvl == null || rio == null) {
        return res.status(400).json({
          success: false,
          error: "Tous les champs sont requis.",
        });
      }

      const newCharacter = await Character.createCharacter({
        name,
        class_ID,
        role_ID,
        ilvl,
        rio,
      });

      res.status(201).json({
        success: true,
        message: "Personnage créé avec succès.",
        character: newCharacter,
      });
    } catch (err) {
      console.error("Erreur createCharacter:", err);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la création du personnage.",
      });
    }
  },

  updateCharacter: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, class_ID, role_ID, ilvl, rio } = req.body;
  
      const updatedCharacter = await Character.updateCharacter(id, {
        name,
        class_ID,
        role_ID,
        ilvl,
        rio,
      });
  
      res.status(200).json({
        success: true,
        message: "Personnage mis à jour avec succès.",
        character: updatedCharacter,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la mise à jour du personnage.",
      });
    }
  },
  
  deleteCharacter: async (req, res) => {
    try {
      const { id } = req.params;
      await Character.deleteCharacter(id);
      res.status(200).json({ success: true, message: "Personnage supprimé." });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la suppression." });
    }
  },

  getCharacterById: async (req, res) => {
    try {
      const { id } = req.params;
      const character = await Character.getCharacterById(id);

      if (!character) {
        return res.status(404).json({ success: false, error: "Personnage introuvable." });
      }

      res.status(200).json({ success: true, character });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la récupération du character." });
    }
  },

  getCharactersForTeam: async (req, res) => {
    try {
      const characters = await Character.getCharactersForTeam();
      res.status(200).json({
        success: true,
        characters,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des characters.",
      });
    }
  },

  getCharactersByIds: async (req, res) => {
    try {
      const { characterIds } = req.body;
      if (!characterIds || characterIds.length === 0) {
        return res.status(400).json({ success: false, error: "Aucun ID fourni." });
      }

      const characters = await Character.getCharactersByIds(characterIds);
      res.status(200).json({ success: true, characters });
    } catch (err) {
      res.status(500).json({ success: false, error: "Erreur lors de la récupération des personnages." });
    }
  },
};
