const Class = require("../models/classModel");

module.exports = {
  getAllClasses: async (req, res) => {
    try {
      const result = await Class.getAllClasses();
      res.status(200).json({
        success: true,
        classes: result,
      });
    } catch (err) {
      console.error("Erreur lors de la récupération des classes :", err);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des classes.",
      });
    }
  },

  getClassById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Class.getClassById(id);
      if (result) {
        res.status(200).json({ success: true, class: result });
      } else {
        res.status(404).json({ success: false, error: "Classe introuvable." });
      }
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          error: "Erreur lors de la récupération de la classe.",
        });
    }
  },
};
