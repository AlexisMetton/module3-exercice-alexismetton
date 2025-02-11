const Dungeons = require("../models/dungeonsModel");

module.exports = {
  getAllDungeons: async (req, res) => {
    try {
      const dungeons = await Dungeons.getAllDungeons();
      res.status(200).json({
        success: true,
        dungeons,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des donjons.",
      });
    }
  },
};
